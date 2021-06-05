import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, combineLatest, Subject, timer} from 'rxjs';
import {Measurement, MeasurementHistory, UpdateFrequency} from './entities';
import {switchMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MeasurementService {
  deviceId = "2f0d295f-9cf5-4959-897a-7b7970dae938";

  currentValues$$ = new Subject<Measurement>();
  historyValues$$ = new Subject<MeasurementHistory>();
  frequency$ = new BehaviorSubject<UpdateFrequency>(1);

  constructor(
      private httpClient: HttpClient,
  ) {
    timer(0,4000).pipe(
        switchMap(() => {
            return this.httpClient.get(`http://localhost:3000/api/getCurrentValue/${this.deviceId}`)
        })
    ).subscribe((result) => {
        this.currentValues$$.next(result as Measurement);
    });

    combineLatest([this.frequency$, timer(0,4000)]).pipe(
        switchMap(([frequency, _]) => {
            return this.httpClient.get(`http://localhost:3000/api/getHistory/${this.deviceId}/${frequency}`)
        })
    ).subscribe((result) => {
      this.historyValues$$.next(result as MeasurementHistory);
    });
  }

}

