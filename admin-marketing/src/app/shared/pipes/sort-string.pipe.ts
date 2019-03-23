declare var window:any;

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'sortString'})
export class SortStringPipe implements PipeTransform {
	transform(array: any[], field: string): any[] {
	    array.sort((a: any, b: any) => {
	      	return a.name.localeCompare(b.name);
	    });
	    return array;
  	} 
}
