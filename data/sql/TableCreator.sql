DROP TABLE IF EXISTS Food;

CREATE TABLE Food(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name text UNIQUE,
    chicken BOOLEAN DEFAULT false,
    beef BOOLEAN DEFAULT false,
    pork BOOLEAN DEFAULT false,
    poultry BOOLEAN DEFAULT false,
    dairy BOOLEAN DEFAULT false,
    buckwheat BOOLEAN DEFAULT false,
    peanut BOOLEAN DEFAULT false,
    walnut BOOLEAN DEFAULT false,
    soybean BOOLEAN DEFAULT false,
    flour BOOLEAN DEFAULT false,
    mackerel BOOLEAN DEFAULT false,
    crab BOOLEAN DEFAULT false,
    shrimp BOOLEAN DEFAULT false,
    squid BOOLEAN DEFAULT false,
    clam BOOLEAN DEFAULT false,
    peach BOOLEAN DEFAULT false,
    tomato BOOLEAN DEFAULT false,
    sulfite BOOLEAN DEFAULT false,
    pine_nut BOOLEAN DEFAULT false
);

SELECT * FROM Food;

