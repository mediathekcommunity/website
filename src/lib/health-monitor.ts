// src/lib/health-monitor.ts

import * as schema from "../schema";
import { createClient, db } from "./db";

// In-memory cache for health metrics
const healthCache: Record<string, any> = {
	lastCheck: null,
	metrics: {},
	logs: [],
};

// Maximum number of logs to keep
const MAX_LOG_ENTRIES = 200;

/**
 * Get system health metrics
 */
export async function getSystemHealth(
	source: string = "local",
): Promise<Record<string, string>> {
	try {
		// If we have cached metrics less than 5 minutes old, use them
		if (healthCache.lastCheck && Date.now() - healthCache.lastCheck < 300000) {
			return healthCache.metrics;
		}

		const client = createClient(source);

		// Run some system checks in parallel
		const [dbCheck, contentCheck] = await Promise.allSettled([
			// Database connectivity check
			client
				.execute("SELECT 1")
				.then(() => "ok")
				.catch(() => "error"),

			// Content integrity check (simplified - just checks if any content exists)
			client
				.execute("SELECT COUNT(*) FROM mediathek")
				.then((result) => {
					const count = Number(result.rows[0][0]);
					return count > 0 ? "ok" : "error";
				})
				.catch(() => "error"),
		]);

		// File system check - simple test
		let fileSystemCheck = "error";
		try {
			const fs = await import("fs/promises");
			await fs.access(".");
			fileSystemCheck = "ok";
		} catch {
			fileSystemCheck = "error";
		}

		// API connection check
		let apiConnectionCheck = "error";
		try {
			const response = await fetch("https://api3.mediathek.community/status");
			apiConnectionCheck = response.ok ? "ok" : "error";
		} catch {
			apiConnectionCheck = "error";
		}

		// Memory usage check
		const memoryUsage = process.memoryUsage();
		const memoryCheck =
			memoryUsage.heapUsed / memoryUsage.heapTotal < 0.9 ? "ok" : "error";

		// Update cache
		const metrics = {
			database_connection:
				dbCheck.status === "fulfilled" ? dbCheck.value : "error",
			content_integrity:
				contentCheck.status === "fulfilled" ? contentCheck.value : "error",
			file_system: fileSystemCheck,
			api_connection: apiConnectionCheck,
			memory_usage: memoryCheck,
		};

		healthCache.metrics = metrics;
		healthCache.lastCheck = Date.now();

		// Log health check
		addSystemLog(
			`Health check completed - DB: ${metrics.database_connection}, Content: ${metrics.content_integrity}`,
		);

		return metrics;
	} catch (error) {
		console.error("Error getting system health:", error);

		// Log error
		addSystemLog(
			`Health check failed: ${error instanceof Error ? error.message : "Unknown error"}`,
		);

		return {
			database_connection: "error",
			content_integrity: "error",
			file_system: "error",
			api_connection: "error",
			memory_usage: "error",
		};
	}
}

/**
 * Run a comprehensive health check
 */
export async function runHealthCheck(
	source: string = "local",
): Promise<Record<string, any>> {
	try {
		// Clear health cache to force fresh checks
		healthCache.lastCheck = null;

		// Get basic health metrics
		const metrics = await getSystemHealth(source);

		// Additional checks
		const client = createClient(source);

		// Table counts
		const tables = ["mediathek", "channel", "medialinks_series"];
		const counts: Record<string, number> = {};

		for (const table of tables) {
			try {
				const result = await client.execute(`SELECT COUNT(*) FROM ${table}`);
				counts[table] = Number(result.rows[0][0]);
			} catch (error) {
				counts[table] = -1; // Error indicator
			}
		}

		// Log health check run
		addSystemLog(
			`Full health check run on ${source} database. All metrics updated.`,
		);

		return {
			success: true,
			metrics,
			counts,
			timestamp: new Date().toISOString(),
		};
	} catch (error) {
		console.error("Error running health check:", error);

		// Log error
		addSystemLog(
			`Full health check failed: ${error instanceof Error ? error.message : "Unknown error"}`,
		);

		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
			timestamp: new Date().toISOString(),
		};
	}
}

/**
 * Test a database connection
 */
export async function testDatabaseConnection(
	connectionId: string,
): Promise<boolean> {
	try {
		// Only allow testing local or cloud connections
		if (connectionId !== "local" && connectionId !== "cloud") {
			return false;
		}

		const client = createClient(connectionId);
		const result = await client.execute("SELECT 1");

		// Log connection test
		addSystemLog(
			`Connection test for ${connectionId}: ${result ? "Success" : "Failed"}`,
		);

		return !!result;
	} catch (error) {
		console.error(`Error testing ${connectionId} connection:`, error);

		// Log error
		addSystemLog(
			`Connection test for ${connectionId} failed: ${error instanceof Error ? error.message : "Unknown error"}`,
		);

		return false;
	}
}

/**
 * Add an entry to the system log
 */
export function addSystemLog(message: string): void {
	const timestamp = new Date().toISOString();
	const logEntry = `[${timestamp}] ${message}`;

	// Add to the beginning for reverse chronological order
	healthCache.logs.unshift(logEntry);

	// Keep logs within size limit
	if (healthCache.logs.length > MAX_LOG_ENTRIES) {
		healthCache.logs = healthCache.logs.slice(0, MAX_LOG_ENTRIES);
	}
}

/**
 * Get system logs
 */
export async function getSystemLogs(): Promise<string[]> {
	// If no logs exist yet, add an initial entry
	if (healthCache.logs.length === 0) {
		addSystemLog("System logs initialized");
	}

	return healthCache.logs;
}

/**
 * Clear system logs
 */
export async function clearSystemLogs(): Promise<void> {
	healthCache.logs = [];
	addSystemLog("System logs cleared");
}
