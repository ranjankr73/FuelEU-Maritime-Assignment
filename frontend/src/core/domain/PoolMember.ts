export class PoolMember {
  constructor(
    public shipId: string,
    public cbBefore: number,
    public cbAfter: number = cbBefore
  ) {}
}
