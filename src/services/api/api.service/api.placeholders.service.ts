export const careerService = {
    getAnalysis: () => Promise.resolve({ data: {} }),
    getHistory: () => Promise.resolve({ data: [] }),
    listRoles: () => Promise.resolve({ data: [] }),
    getRoleDetails: () => Promise.resolve({ data: {} }),
    analyzeFile: () => Promise.resolve({ data: {} }),
    analyzeText: () => Promise.resolve({ data: {} }),
} as any

export const jobsService = {
    getJobs: () => Promise.resolve({ data: [] }),
    getJobById: () => Promise.resolve({ data: {} }),
    searchJobs: () => Promise.resolve({ data: [] }),
    getSavedJobs: () => Promise.resolve({ data: [] }),
    getApplications: () => Promise.resolve({ data: [] }),
    saveJob: () => Promise.resolve({ data: {} }),
    unsaveJob: () => Promise.resolve({ data: {} }),
    applyToJob: () => Promise.resolve({ data: {} }),
    updateApplicationStatus: () => Promise.resolve({ data: {} }),
} as any

export const scraperService = {
    getSessions: () => Promise.resolve({ data: [] }),
    getSession: () => Promise.resolve({ data: {} }),
    startScraping: () => Promise.resolve({ data: {} }),
    stopSession: () => Promise.resolve({ data: {} }),
} as any

export const companiesService = {
    getCompanies: () => Promise.resolve({ data: [] }),
    getCompanyById: () => Promise.resolve({ data: {} }),
    getCompanyJobs: () => Promise.resolve({ data: [] }),
} as any

export const jobAnalysisService = {
    getAnalyses: () => Promise.resolve({ data: [] }),
    getAnalysisByJobId: () => Promise.resolve({ data: {} }),
    getStats: () => Promise.resolve({ data: {} }),
    getRecommended: () => Promise.resolve({ data: [] }),
} as any

export const statisticsService = {
    getOverview: () => Promise.resolve({ data: {} }),
    getJobsByLocation: () => Promise.resolve({ data: [] }),
    getJobsByCompany: () => Promise.resolve({ data: [] }),
    getTopSkills: () => Promise.resolve({ data: [] }),
} as any

export const dashboardService = {
    getOverview: () => Promise.resolve({ data: {} }),
    getStats: () => Promise.resolve({ data: {} }),
    getRecentApplications: () => Promise.resolve({ data: [] }),
    getRecommendations: () => Promise.resolve({ data: [] }),
} as any

export const automationService = {
    getConfig: () => Promise.resolve({ data: {} }),
    getStatus: () => Promise.resolve({ data: {} }),
    getHistory: () => Promise.resolve({ data: [] }),
    updateConfig: () => Promise.resolve({ data: {} }),
    start: () => Promise.resolve({ data: {} }),
    stop: () => Promise.resolve({ data: {} }),
} as any
