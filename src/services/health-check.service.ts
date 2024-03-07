import { HealthCheckResponse } from "../types/health-check.types";

export async function getHealtyServer(): Promise<HealthCheckResponse> {

    return {
        status: "healthy",
        success: true
    }
}

export async function getUnhealtyServer(): Promise<HealthCheckResponse> {

    return {
        status: "unhealthy",
        success: false
    }
}