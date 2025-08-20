CREATE TABLE bonsai (
username VARCHAR(50),
nickname VARCHAR(50),
meal_plan meal[],
workout_plan workout[],

)

CREATE TYPE plan AS ENUM (
'meal',
'workout'
)

#ENSURE ALL OF THE LISTS HAVE PROPER INDEXING THATS CONSTANT
CREATE TYPE meal_plan (
foods food[],
start DATE,
end DAT
) INHERITS (plan)

CREATE TYPE workout_plan (
workout workout[],
start DATE,
end DAT
) INHERITS (plan)

CREATE TYPE workout (

)

CREATE TYPE food (
quantity integer,
nutrients macros
)

CREATE TYPE macros (
calories inte