import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchGifsResponse, Gif } from '../interface/gifs.interface'

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private _historial: string[] = [];
  private apiKey: string = 'p6X2Kq3v3NgZd0jmL9copQmb42BSfska';
  public resultados: Gif[] = [];
  private servicioURL: string = 'https://api.giphy.com/v1/gifs';

  get historial() {
    return [...this._historial];
  }

  constructor (private http: HttpClient) {

    // Se puede hacer de las dos formas, con un pipe que si no hay nada en el localStorage devuelva un array vacio
    // o comprobando con un if si hay algo en localStorage (importante el simbolo de exclamación)

    this._historial = JSON.parse(localStorage.getItem('historial')! ) || [];
    this.resultados = JSON.parse(localStorage.getItem('resultados')! ) || [];
    // if(localStorage.getItem('historial')) {
    //   this._historial = JSON.parse(localStorage.getItem('historial')! );
    // }
  }

  buscarGifs(query: string) {

    query = query.trim().toLowerCase();

    if(!this._historial.includes(query)) {
      this._historial.unshift(query);
      this._historial = this._historial.splice(0,10);

      localStorage.setItem('historial',JSON.stringify(this._historial));
    }

    const params = new HttpParams()
          .set('api_key', this.apiKey)
          .set('limit', '10')
          .set('q', query);

    this.http.get<SearchGifsResponse>(`${this.servicioURL}/search`, { params })
      .subscribe( (resp ) => {
        this.resultados = resp.data;
        localStorage.setItem('resultados',JSON.stringify(this.resultados));
      });
  }
}
