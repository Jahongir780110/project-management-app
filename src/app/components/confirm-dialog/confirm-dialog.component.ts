import { Component, OnInit, Inject } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css'],
})
export class ConfirmDialogComponent implements OnInit {
  constructor(
    private translateService: TranslateService,
    public dialogRef: DialogRef<string>,
    @Inject(DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  get dialogTitle() {
    let title = '';

    switch (this.data.type) {
      case 'board':
        title = 'deleteBoardPrompt';
        break;
      case 'user':
        title = 'deleteUserPrompt';
        break;
      case 'task':
        title = 'deleteTaskPrompt';
        break;
      case 'column':
        title = 'deleteColumnPrompt';
        break;
    }

    return this.translateService.instant(title);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  delete() {
    if (this.data.type === 'board') {
      this.dialogRef.close(this.data.id);
    } else if (this.data.type === 'user') {
      this.dialogRef.close('delete');
    } else if (this.data.type === 'task') {
      this.dialogRef.close('delete');
    } else if (this.data.type === 'column') {
      this.dialogRef.close('delete');
    }
  }
}
