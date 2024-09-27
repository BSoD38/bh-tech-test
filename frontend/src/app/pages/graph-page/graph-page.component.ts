import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { MatButton, MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FilteringApiService } from '../../services/filtering-api.service';
import { RawData } from '../../models/raw-data';
import { FilteredData } from '../../models/filtered-data';
import { ModifiedData } from '../../models/modified-data';
import { Chart, ChartTypeRegistry, Point } from 'chart.js/auto';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import {
  MatDatepicker,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { MatInput } from '@angular/material/input';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { DateTimeSelectorComponent } from '../../components/date-time-selector/date-time-selector.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { NameChangeDialogComponent } from '../../components/name-change-dialog/name-change-dialog.component';

type PointWithId = Omit<Point, 'x'> & { x: Date; id: number };

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
    MatSlideToggle,
    DateTimeSelectorComponent,
    MatButton,
  ],
  templateUrl: './graph-page.component.html',
  styleUrl: './graph-page.component.scss',
})
export class GraphPageComponent implements OnInit, AfterViewInit, OnDestroy {
  private _snackBar = inject(MatSnackBar);
  startDate: Date;

  endDate: Date | undefined = undefined;

  lastPoll: Date | undefined;
  isPolling = false;

  showModifiedData: WritableSignal<boolean> = signal(true);
  interval?: ReturnType<typeof setInterval>;

  rawData: RawData[] = [];
  filteredData: FilteredData[] = [];
  modifiedData: ModifiedData[] = [];
  mergedModifiedRawData: Map<number, RawData> = new Map<number, RawData>();

  chart?: Chart<keyof ChartTypeRegistry, PointWithId[], unknown>;

  @ViewChild('chart') chartRef!: ElementRef;

  readonly dialog = inject(MatDialog);

  constructor(
    private authService: AuthService,
    private filteringService: FilteringApiService,
  ) {
    // Get start of current day
    const date = new Date(Date.now());
    date.setHours(0, 0, 0, 0);
    this.startDate = date;
  }

  get user(): User {
    return this.authService.currentUser()!;
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  ngOnInit(): void {
    this.startInterval();
  }

  startInterval(): void {
    // TODO: Transition to WebSockets to reduce latency, network and CPU usage
    this.interval = setInterval(() => {
      this.pollChartData();
    }, 2000);
    this.isPolling = true;
  }

  stopInterval(): void {
    clearInterval(this.interval);
    this.isPolling = false;
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
            if (!this.showModifiedData()) {
              return;
            }
            const i = elements[0].index;
            const ds = elements[0].datasetIndex;
            // dataset 1 is raw data
            if (ds !== 1) {
              return;
            }
            const point = chart.data.datasets[ds].data[
              i
            ] as unknown as PointWithId;

            const rawData = this.rawData.find((d) => d.id === point.id);
            if (rawData) {
              await this.filteringService.createModifiedData(rawData);
              this._snackBar.open('Raw data modified');
            }
          }
        },
      },
    });
  }

  updateStartDate(event: Date): void {
    if (!event) {
      return;
    }
    this.startDate = event;
    this.lastPoll = undefined;
    this.rawData = [];
    this.filteredData = [];
    this.modifiedData = [];
    this.mergedModifiedRawData = new Map();
    this.updateChart();
    this.stopInterval();
    this.startInterval();
  }

  updateEndDate(event: Date): void {
    if (!event) {
      return;
    }
    this.endDate = event;
    this.lastPoll = undefined;
    this.rawData = [];
    this.filteredData = [];
    this.modifiedData = [];
    this.mergedModifiedRawData = new Map();
    this.updateChart();
    this.stopInterval();
    this.startInterval();
  }

  toggleDisplayModifiedData(): void {
    this.showModifiedData.set(!this.showModifiedData());
    this.updateChart();
  }

  updateChart() {
    const useModified = this.showModifiedData()
      ? Array.from(this.mergedModifiedRawData.values())
      : this.rawData;
    this.chart!.data.datasets[0].data = this.filteredData.map(
      (d) =>
        ({
          x: d.date,
          y: d.value,
          id: d.id,
        }) as PointWithId,
    );
    this.chart!.data.datasets[1].data = useModified.map(
      (d) =>
        ({
          x: d.date,
          y: d.value,
          id: d.id,
        }) as PointWithId,
    );
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

  async pollChartData(): Promise<void> {
    // Do not poll for data if the last poll is later than the end date
    if (
      this.endDate &&
      (this.lastPoll?.getTime() ?? 0) > (this.endDate?.getTime() ?? 0)
    ) {
      return;
    }
    // Do not poll for data if the start date is in the future
    if (this.startDate.getTime() > Date.now()) {
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
    } else {
      [this.rawData, this.filteredData, this.modifiedData] = await Promise.all([
        this.filteringService.getRawDataRange(startDate!, this.endDate),
        this.filteringService.getFilteredDataRange(startDate!, this.endDate),
        this.filteringService.getModifiedDataRange(startDate!, this.endDate),
      ]);
    }
    this.mergeModifiedDataIntoRawData();
    this.updateChart();
    this.lastPoll = new Date(Date.now());
  }

  openUsernameChangeDialog(): void {
    const dialogRef = this.dialog.open(NameChangeDialogComponent, {
      data: { username: this.user.username },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.authService.changeUsername(result);
        this._snackBar.open('Username changed');
      }
    });
  }
}
