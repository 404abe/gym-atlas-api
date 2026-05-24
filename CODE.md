Route file        → just Express wiring, middleware, no logic
Controller        → parse req, call service, send res, handle HTTP errors
Service           → business rules, validation, orchestration
Repository        → SQL queries only, no logic