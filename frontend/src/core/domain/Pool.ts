import { PoolMember } from "./PoolMember";

export class Pool {
  constructor(public year: number, public members: PoolMember[]) {}

  totalCB(): number {
    return this.members.reduce((sum, m) => sum + m.cbBefore, 0);
  }

  isValid(): boolean {
    return this.totalCB() >= 0;
  }

  applyPoolingRules(): PoolMember[] {
    if (!this.isValid())
      throw new Error("Invalid pool: total CB must be ≥ 0");

    const sorted = [...this.members].sort((a, b) => b.cbBefore - a.cbBefore);
    let remainingSurplus = this.totalCB();

    return sorted.map((member) => {
      if (member.cbBefore < 0 && remainingSurplus > 0) {
        const applied = Math.min(-member.cbBefore, remainingSurplus);
        remainingSurplus -= applied;
        return new PoolMember(member.shipId, member.cbBefore, member.cbBefore + applied);
      }
      return member;
    });
  }

  toJSON() {
    return {
      year: this.year,
      totalCB: this.totalCB(),
      members: this.members,
    };
  }
}
