import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface PresignedPostResponse {
  url: string;
  fields: Record<string, string>;
  imagenUrl: string;
  expiresIn: number;
}

@Injectable({ providedIn: 'root' })
export class UploadsService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private obtenerPresignedPost(contentType: string): Observable<PresignedPostResponse> {
    return this.http.post<PresignedPostResponse>(`${this.apiUrl}/uploads/presigned-post`, { contentType });
  }

  private subirArchivo(presigned: PresignedPostResponse, file: File): Observable<PresignedPostResponse> {
    const formData = new FormData();
    Object.entries(presigned.fields).forEach(([key, value]) => formData.append(key, value));
    formData.append('file', file);
    return this.http.post(presigned.url, formData).pipe(map(() => presigned));
  }

  subirFoto(file: File): Observable<string> {
    return this.obtenerPresignedPost(file.type).pipe(
      switchMap(presigned => this.subirArchivo(presigned, file)),
      map(presigned => presigned.imagenUrl)
    );
  }
}
