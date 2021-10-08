export interface IModalToggleEvent {
  getTitle: () => string;
  isVisible: () => boolean;
}

export const IModalToggleEventName = 'modalToggleEvent';

export class ModalToggleEvent implements IModalToggleEvent {
  constructor(
    private readonly title: string,
    private readonly visible: boolean,
  ) {}

  getTitle(): string {
    return this.title;
  }

  isVisible(): boolean {
    return this.visible;
  }
}
