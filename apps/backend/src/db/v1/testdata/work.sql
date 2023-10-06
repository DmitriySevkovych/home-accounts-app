-- -- work
INSERT INTO
  work.projects (
    "key",
    customer,
    "start_date",
    end_date,
    "location",
    hourly_rate,
    flat_price,
    recruiter,
    "comment",
    planned_volume,
    contact_person
  )
VALUES
  (
    'PROJECT_1',
    'CUSTOMER_X',
    '2022-10-01',
    '2023-09-30',
    '100% remote',
    NULL,
    200000,
    NULL,
    'Dummy flat-price project',
    '40h/week',
    'John Doe'
  ),
  (
    'PROJECT_2',
    'CUSTOMER_Y',
    '2023-10-01',
    NULL,
    '100% remote',
    150,
    NULL,
    'SOME_RECRUITER',
    'Dummy hourly rate project',
    '32h/week',
    'Samuel Pickwick'
  );

INSERT INTO
  work.project_invoices (
    "key",
    "date",
    "due_date",
    project,
    net_amount,
    vat,
    discount,
    "status",
    "comment"
  )
VALUES
  (
    'INV-0123456',
    '2019-05-01',
    '2019-06-01',
    'PROJECT_1',
    12333.45,
    0.19,
    0,
    'OPEN',
    'Dummy invoce'
  ),
  (
    'INV-0123457',
    '2019-07-03',
    '2019-08-02',
    'PROJECT_2',
    5432.10,
    0.19,
    0.03,
    'PAID',
    'Second dummy invoce'
  )
