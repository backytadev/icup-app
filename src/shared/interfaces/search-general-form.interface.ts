export interface GeneralSearchForm {
  offset?: string;
  limit?: string;
  all?: boolean;
  allByDate?: boolean;
  order: string;
  dateTerm?:
    | {
        from: Date;
        to?: Date | undefined;
      }
    | undefined;
  churchId?: string;
}
