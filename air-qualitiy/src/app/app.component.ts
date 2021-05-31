import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MeasurementService} from './measurement.service';
import {Observable, Subject} from 'rxjs';
import {MeasurementHistory, MeasurementKeys} from './entities';
import {FormControl, FormGroup} from '@angular/forms';
import {TuiOrientation} from '@taiga-ui/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  constructor(
      private measurementService: MeasurementService,
  ) {
  }
  frequencyItems: Object[] = [
    {id: 0.25, name: '15 мин'},
    {id: 1, name: '1 час'},
    {id: 6, name: '6 часов'},
    {id: 12, name: '12 часов'},
    {id: 24, name: '24 часа'},
    {id: 168, name: 'Неделя'},
  ];
  radiolistOrientation: TuiOrientation = TuiOrientation.Horizontal;

  frequencyFC = new FormControl(this.frequencyItems[1]);
  currentValues$: Observable<any> | undefined;
  charts$ = new Subject<Record<MeasurementKeys, Object>>();

  frequencyForm = new FormGroup({
    value: new FormControl(this.frequencyItems[1]),
  });

  ngOnInit() {
    this.currentValues$ = this.measurementService.currentValues$$;
    this.measurementService.historyValues$$.subscribe(r => {
      this.charts$.next({
        temperature: this.createChart(r, 'temperature'),
        humidity: this.createChart(r, 'humidity'),
        co2: this.createChart(r, 'co2'),
        pm2: this.createChart(r, 'pm2'),
      });
    })

    this.frequencyForm.get('value')?.valueChanges.subscribe((it) => {
      this.measurementService.frequency$.next(it.id);
    });
  }

  private createChart(r: MeasurementHistory, key: MeasurementKeys) {
    return {
      xAxis: {
        type: 'time'
      },
      yAxis: {
        type: 'value',
        min: 'dataMin',
      },
      grid: {
        left: 40,
        top: 10,
        right: 10,
        bottom: 20
      },
      series: [
        {
          data: r.map(it => [it.timestamp, it[key]]),
          type: 'line',
          smooth: true,
          showSymbol: false,
          areaStyle: {}
        },
      ]
    }
  }
}
