import { BusinessRuleViolationError } from "../../shared/errors/DomainError";
import { PoolMember } from "../../shared/types/PoolMemberInterface";

export class Pool {
  constructor(public year: number, public members: PoolMember[], public id?: number) {}

  totalCB(): number {
    return this.members.reduce((sum, m) => sum + m.cbBefore, 0);
  }

  isValid(): boolean {
    return this.totalCB() >= 0;
  }

  applyPoolingRules(): PoolMember[] {
    if (!this.isValid())
      throw new BusinessRuleViolationError("Invalid pool: total CB < 0");

    const sorted = [...this.members].sort((a, b) => b.cbBefore - a.cbBefore);
    let remainingSurplus = this.totalCB();

    const result = sorted.map(member => {
      if (member.cbBefore < 0 && remainingSurplus > 0) {
        const applied = Math.min(-member.cbBefore, remainingSurplus);
        remainingSurplus -= applied;
        return { ...member, cbAfter: member.cbBefore + applied };
      }
      return { ...member, cbAfter: member.cbBefore };
    });

    result.forEach(m => {
      if (m.cbAfter! < 0)
        throw new BusinessRuleViolationError(`Deficit ship ${m.shipId} exits worse off.`);
    });

    return result;
  }

  toJSON() {
    return {
      id: this.id,
      year: this.year,
      totalCB: this.totalCB(),
      members: this.members,
      isValid: this.isValid(),
    };
  }
}
