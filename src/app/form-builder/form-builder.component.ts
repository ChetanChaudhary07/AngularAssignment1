import { CommonModule } from '@angular/common';
import { Component, OnChanges, OnInit, SimpleChanges, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-builder',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.css']
})
export class FormBuilderComponent implements OnInit, OnChanges {
  @Input() inputName: string = '';
  @Input() inputType: string = 'text';
  @Input() required: string = 'false';
  @Input() inputLabel: string = '';
  formElements: any[] = [];
  generatedFormHtml: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Initialize default values or load saved data if required
    this.resetForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['inputName'] || changes['inputType'] || changes['required'] || changes['inputLabel']) {
      console.log('Form input properties changed:', changes);
    }
  }

  navigateToDynamicForm(): void {
    this.router.navigate(['/dynamic-form'], {
      queryParams: { formElements: JSON.stringify(this.formElements) },
    });
  }

  addElement(): void {
    if (!this.inputName || !this.inputLabel) {
      alert('Please fill in all fields');
      return;
    }

    const newElement = {
      name: this.inputName,
      type: this.inputType,
      required: this.required === 'true',
      label: this.inputLabel,
    };

    this.formElements.push(newElement);

    // Reset the form inputs after adding the element
    this.resetForm();
  }

  createForm(): void {
    let formHTML = 
`<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Form</title>
  </head>
  <body>
    <form id="dynamicForm">\n`;
  
    this.formElements.forEach(element => {
      formHTML += `      <label for="${element.name}">${element.label}</label>\n`;
  
      if (element.type === 'dropdown') {
        formHTML += `        <select name="${element.name}" id="${element.name}"${element.required ? ' required' : ''}>\n`;
        formHTML += `        <option value="Option 1">Option 1</option>\n`;
        formHTML += `        </select>\n`;
      } else {
        formHTML += `      <input type="${element.type}" name="${element.name}" id="${element.name}"${element.required ? ' required' : ''}>\n`;
      }
    });
  
    formHTML += `    </form>
  </body>
</html>`;
  
    this.generatedFormHtml = formHTML;
  }
  

  private resetForm(): void {
    this.inputName = '';
    this.inputType = 'text';
    this.required = 'false';
    this.inputLabel = '';
  }
}
