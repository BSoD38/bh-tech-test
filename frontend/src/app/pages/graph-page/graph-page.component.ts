import {
  AfterViewInit,
  Component, ElementRef,
  OnDestroy,
  OnInit,
  signal, ViewChild,
  WritableSignal,
} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FilteringApiService } from '../../services/filtering-api.service';
import { RawData } from '../../models/raw-data';
import { FilteredData } from '../../models/filtered-data';
import { ModifiedData } from '../../models/modified-data';
import { Chart } from 'chart.js/auto';
import { MatFormField, MatFormFieldModule, MatHint, MatLabel } from '@angular/material/form-field';
import {
  MatDatepicker,
  MatDatepickerInputEvent, MatDatepickerModule,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { MatInput, MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSlideToggle } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-graph-page',
  standalone: true,
  imports: [
    MatFabButton,
    MatIcon,
    MatFormField,
    MatDatepickerToggle,
    MatDatepicker,
    MatInput,
    MatHint,
    MatLabel,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatSlideToggle,
  ],
  templateUrl: './graph-page.component.html',
  styleUrl: './graph-page.component.scss',
})
export class GraphPageComponent implements OnInit, AfterViewInit, OnDestroy {
  startDate: Date | undefined;
  startTimeControl = new FormControl('00:00', [
    Validators.required,
    Validators.pattern(/[0-2][0-9]:[0-5][0-9]/),
  ]);

  endDate: Date | undefined = undefined;
  endTimeControl = new FormControl(
    '',
    Validators.pattern(/[0-2][0-9]:[0-5][0-9]/),
  );

  lastPoll: Date | undefined;

  showModifiedData: WritableSignal<boolean> = signal(true);
  interval?: ReturnType<typeof setInterval>;

  rawData: RawData[] = [];
  filteredData: FilteredData[] = [];
  modifiedData: ModifiedData[] = [];
  mergedModifiedRawData: Map<number, RawData> = new Map<number, RawData>();

  chart?: Chart;

  @ViewChild('chart') chartRef!: ElementRef;

  constructor(
    private authService: AuthService,
    private filteringService: FilteringApiService,
  ) {
    // Get start of current day
    const date = new Date(Date.now());
    date.setUTCHours(0, 0, 0, 0);
    this.startDate = date;
  }

  get user(): User {
    return this.authService.currentUser()!;
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  ngOnInit(): void {
    this.startTimeControl.valueChanges.subscribe((value) => {
      if (!this.startTimeControl.valid) {
        return;
      }
      this.updateStartTime(value ?? '');
    });
    this.endTimeControl.valueChanges.subscribe((value) => {
      if (!this.endTimeControl.valid) {
        return;
      }
      this.updateStartTime(value ?? '');
    });
    this.startInterval();
  }

  startInterval(): void {
    // TODO: Transition to WebSockets to reduce latency, network and CPU usage
    this.interval = setInterval(() => {
      this.pollChartData();
    }, 2000);
  }

  ngAfterViewInit(): void {
    // Setup chart.js
    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Filtered Data',
            data: [],
          },
          {
            label: 'Raw Data',
            data: [],
          },
        ],
      },
      options: {
        onClick: async (event, elements, chart) => {
          if (elements[0]) {
            const i = elements[0].index;
            const ds = elements[0].datasetIndex;
            // dataset 1 is raw data
            if (ds !== 1) {
              return;
            }
            const point = chart.data.datasets[ds].data[i];

            const rawData = this.rawData.find(
              (d) => d.id === (point as any).id,
            );
            if (rawData) {
              await this.filteringService.createModifiedData(rawData);
            }
          }
        },
      },
    });
  }

  updateStartDate(event: MatDatepickerInputEvent<Date>): void {
    if (!event.value) {
      return;
    }
    this.startDate = event.value;
    this.lastPoll = undefined;
    this.rawData = [];
    this.filteredData = [];
    this.modifiedData = [];
    this.mergedModifiedRawData = new Map();
    if (this.startTimeControl.valid) {
      this.updateStartTime(this.startTimeControl.value ?? '');
      return;
    }
    clearInterval(this.interval);
    this.startInterval();
  }

  updateStartTime(value: string): void {
    if (!value) {
      return;
    }
    const [hours, minutes] = value.split(':');
    this.startDate?.setUTCHours(parseInt(hours), parseInt(minutes), 0, 0);
    this.lastPoll = undefined;
    clearInterval(this.interval);
    this.startInterval();
  }

  updateEndDate(event: MatDatepickerInputEvent<Date>): void {
    if (!event.value) {
      return;
    }
    this.endDate = event.value;
    this.lastPoll = undefined;
    this.rawData = [];
    this.filteredData = [];
    this.modifiedData = [];
    this.mergedModifiedRawData = new Map();
    if (!this.endTimeControl.value || !this.endTimeControl.valid) {
      this.endTimeControl.setValue('00:00');
      this.updateEndTime(this.endTimeControl.value ?? '');
      return;
    }
    if (this.endTimeControl.valid) {
      this.updateEndTime(this.endTimeControl.value ?? '');
      return;
    }
    clearInterval(this.interval);
    this.startInterval();
  }

  updateEndTime(value: string): void {
    if (!value) {
      return;
    }
    const [hours, minutes] = value.split(':');
    this.endDate?.setUTCHours(parseInt(hours), parseInt(minutes), 0, 0);
    this.lastPoll = undefined;
    clearInterval(this.interval);
    this.startInterval();
  }

  toggleDisplayModifiedData(): void {
    this.showModifiedData.set(!this.showModifiedData());
    this.updateChart();
  }

  partialUpdateChart(
    newDataRawData: RawData[],
    newDataFilteredData: FilteredData[],
  ): void {
    for (const filteredData of newDataFilteredData) {
      this.chart!.data.datasets[0].data.push({
        x: filteredData.date,
        y: filteredData.value,
        id: filteredData.id,
      } as any);
    }
    for (const rawData of newDataRawData) {
      this.chart!.data.datasets[1].data.push({
        x: rawData.date,
        y: rawData.value,
        id: rawData.id,
      } as any);
    }
  }

  updateChart() {
    const useModified = this.showModifiedData() ? Array.from(this.mergedModifiedRawData.values()) : this.rawData;
    this.chart!.data.datasets = [
      {
        label: 'Filtered Data',
        data: this.filteredData.map((d) => ({
          x: d.date,
          y: d.value,
          id: d.id,
        })) as any,
      },
      {
        label: 'Raw Data',
        data: useModified.map((d) => ({
          x: d.date,
          y: d.value,
          id: d.id,
        })) as any,
      },
    ];
    this.chart!.update('none');
  }

  logoutClicked(): void {
    this.authService.logout();
  }

  mergeModifiedDataIntoRawData(): void {
    for (const rawData of this.rawData) {
      this.mergedModifiedRawData.set(rawData.id, rawData);
    }
    for (const modifiedData of this.modifiedData) {
      if (this.mergedModifiedRawData.has(modifiedData.rawDataId)) {
        const data = structuredClone(
          this.mergedModifiedRawData.get(modifiedData.rawDataId),
        );
        data!.value = modifiedData.newValue;
        this.mergedModifiedRawData.set(modifiedData.rawDataId, data!);
      }
    }
  }

  mergePartialModifiedDataIntoRawData(rawData: RawData[], modifiedData: ModifiedData[]): void {
    for (const rd of rawData) {
      this.mergedModifiedRawData.set(rd.id, rd);
    }
    for (const data of modifiedData) {
      if (this.mergedModifiedRawData.has(data.rawDataId)) {
        const clone = structuredClone(
          this.mergedModifiedRawData.get(data.rawDataId),
        );
        clone!.value = data.newValue;
        this.mergedModifiedRawData.set(data.rawDataId, clone!);
      }
    }
  }

  async pollChartData(): Promise<void> {
    // Do not poll for data if the last poll is later than the end date
    if (this.endDate && (this.lastPoll?.getTime() ?? 0) > (this.endDate?.getTime() ?? 0)) {
      return;
    }
    const startDate = this.lastPoll ?? this.startDate;
    if (this.lastPoll) {
      const [rawData, filteredData, modifiedData] = await Promise.all([
        this.filteringService.getRawDataRange(startDate!, this.endDate),
        this.filteringService.getFilteredDataRange(startDate!, this.endDate),
        this.filteringService.getModifiedDataRange(startDate!, this.endDate),
      ]);
      // Merge new data with existing data, and only do it when useful
      if (rawData.length) {
        this.rawData = this.rawData.concat(rawData);
      }
      if (filteredData.length) {
        this.filteredData = this.filteredData.concat(filteredData);
      }
      if (modifiedData.length) {
        this.modifiedData = this.modifiedData.concat(modifiedData);
      }
      if (this.showModifiedData()) {
        this.mergePartialModifiedDataIntoRawData(rawData, modifiedData);
        this.updateChart();
      } else {
        this.partialUpdateChart(rawData, filteredData);
      }
    } else {
      [this.rawData, this.filteredData, this.modifiedData] = await Promise.all([
        this.filteringService.getRawDataRange(startDate!, this.endDate),
        this.filteringService.getFilteredDataRange(startDate!, this.endDate),
        this.filteringService.getModifiedDataRange(startDate!, this.endDate),
      ]);
      if (this.showModifiedData()) {
        this.mergeModifiedDataIntoRawData();
      }
      this.updateChart();
    }
    this.lastPoll = new Date(Date.now());
  }
}
