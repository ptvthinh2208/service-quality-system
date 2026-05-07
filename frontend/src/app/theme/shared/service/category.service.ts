import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Category, CreateCategoryDto, UpdateCategoryDto, ReorderCategoriesDto } from '../models/category.model';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/admin/categories`;

    getAll(): Observable<Category[]> {
        return this.http.get<any>(this.apiUrl).pipe(
            map(res => res.data as Category[])
        );
    }

    getById(id: number): Observable<Category> {
        return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
            map(res => res.data as Category)
        );
    }

    create(dto: CreateCategoryDto): Observable<Category> {
        return this.http.post<any>(this.apiUrl, dto).pipe(
            map(res => res.data as Category)
        );
    }

    update(id: number, dto: UpdateCategoryDto): Observable<Category> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, dto).pipe(
            map(res => res.data as Category)
        );
    }

    toggleActive(id: number): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${id}/toggle`, {});
    }

    reorder(dto: ReorderCategoriesDto): Observable<any> {
        return this.http.put(`${this.apiUrl}/reorder`, dto);
    }

    delete(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
