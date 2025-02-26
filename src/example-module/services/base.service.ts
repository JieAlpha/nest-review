export interface BaseService {
    getData(): string;
}

export class DefaultBaseService implements BaseService {
    getData(): string {
        return "Default Service Data";
    }
}

export class CustomBaseService implements BaseService {
    getData(): string {
        return "Custom Service Data";
    }
}
