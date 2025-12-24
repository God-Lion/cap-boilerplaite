import { RouteObject } from 'react-router-dom';

export interface CAPModule {
    id: string;
    version: string;
    routes?: RouteObject[];
    store?: any; // To be typed strictly later
    services?: Record<string, unknown>;
    permissions?: string[];
    navigation?: any[];
    i18n?: Record<string, any>;
    hooks?: any;
}
