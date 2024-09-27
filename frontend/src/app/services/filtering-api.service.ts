import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RawData } from '../models/raw-data';
import { lastValueFrom } from 'rxjs';
import { RangeParams } from '../models/range-params';
import { FilteredData } from '../models/filtered-data';
import { ModifiedData } from '../models/modified-data';

@Injectable({
  providedIn: 'root',
})
export class FilteringApiService {
  constructor(private http: HttpClient) {}

  async getRawDataRange(start: Date, end?: Date): Promise<RawData[]> {
    const params: RangeParams = { start: start.toISOString() };
    if (end) {
      params.end = end.toISOString();
    }

    return await lastValueFrom(
      this.http.get<RawData[]>('/api/filtering/raw-data/', {
        params: new HttpParams({ fromObject: params }),
      }),
    );
  }

  async getFilteredDataRange(start: Date, end?: Date): Promise<FilteredData[]> {
    const params: RangeParams = { start: start.toISOString() };
    if (end) {
      params.end = end.toISOString();
    }

    return await lastValueFrom(
      this.http.get<FilteredData[]>('/api/filtering/filtered-data/', {
        params: new HttpParams({ fromObject: params }),
      }),
    );
  }

  async getModifiedDataRange(start: Date, end?: Date): Promise<ModifiedData[]> {
    const params: RangeParams = { start: start.toISOString() };
    if (end) {
      params.end = end.toISOString();
    }

    return await lastValueFrom(
      this.http.get<ModifiedData[]>('/api/filtering/modified-data/', {
        params: new HttpParams({ fromObject: params }),
      }),
    );
  }

  async createModifiedData(rawData: RawData): Promise<ModifiedData> {
    return await lastValueFrom(
      this.http.post<ModifiedData>(
        '/api/filtering/modified-data/',
        { rawDataId: rawData.id },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      ),
    );
  }
}
