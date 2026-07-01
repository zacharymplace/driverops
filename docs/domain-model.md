# Domain Model

## Driver

The person operating the business.

## Vehicle

The business asset used to generate revenue.

Key fields:
- payment
- insurance
- MPG
- fuel cost
- maintenance cost per mile
- depreciation cost per mile
- tax reserve rate

## Shift

A working session.

Key fields:
- start time
- end time
- platform mix
- gross revenue
- miles driven
- fuel cost
- expenses
- net profit
- net per hour
- net per mile

## Expense

A business cost.

Examples:
- fuel
- maintenance
- insurance
- car wash
- tolls
- parking
- phone allocation

## Recommendation

A decision output.

Possible states:
- GO
- PREPARE
- WAIT
- STAND_DOWN

## Alert

A surfaced issue or opportunity.

Examples:
- maintenance due
- reserve below target
- strong earning window
- weak earning pattern
