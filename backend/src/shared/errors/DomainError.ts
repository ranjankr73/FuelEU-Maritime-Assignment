export class DomainError extends Error {
  public readonly code: string;

  constructor(message: string, code: string = "DOMAIN_ERROR") {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR");
    this.name = "ValidationError";
  }
}

export class BusinessRuleViolationError extends DomainError {
  constructor(message: string) {
    super(message, "BUSINESS_RULE_VIOLATION");
    this.name = "BusinessRuleViolationError";
  }
}

export class EntityNotFoundError extends DomainError {
  constructor(entity: string, identifier?: string | number) {
    super(`${entity} not found ${identifier ? `: ${identifier}` : ""}`, "ENTITY_NOT_FOUND");
    this.name = "EntityNotFoundError";
  }
}
