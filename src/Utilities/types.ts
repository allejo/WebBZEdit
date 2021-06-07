export type Vector3F = [number, number, number];
export type TeleporterReference = {
  name: string;
  side: TeleporterSide;
};
export enum TeleporterSide {
  Both = '*',
  Forward = 'f',
  Backward = 'b',
}
