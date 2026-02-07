import request from "@/utils/request";
import type { Result } from "@/models/common";
import type { LogisticsCompany } from "@/models/logistics";

export async function getLogisticsCompanies(): Promise<Result<LogisticsCompany[]>> {
    return request({
        url: "/logistics/companies",
        method: "GET",
    });
}

export async function generateTrackingNo(
    companyCode: string,
): Promise<Result<string>> {
    return request({
        url: "/logistics/tracking-no",
        method: "GET",
        params: { companyCode },
    });
}