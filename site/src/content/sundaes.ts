/** Specialty sundaes, taken from the existing Flavors page. */

export type Treat = { name: string; description: string };

export const twoScoopSundaes: Treat[] = [
  { name: "Banana Fudge Treat", description: "Sliced banana, hot fudge, whipped cream, chocolate sprinkles & a cherry" },
  { name: "Black Forest Sundae", description: "Cherry Vanilla & Chocolate Lover's ice cream with cherry and hot fudge topping, whipped cream, chocolate sprinkles and a cherry" },
  { name: "Brownie Supreme", description: "A warm brownie with hot fudge, whipped cream & chocolate sprinkles" },
  { name: "Peanut Butter Cup Sundae", description: "Peanut butter ice cream, hot fudge, peanut butter topping and chopped Reese's cups, topped with whipped cream and Reese's Pieces" },
  { name: "Butterscotch Fudge Heath", description: "Butterscotch and hot fudge topping with crushed Heath candy, whipped cream & a cherry" },
  { name: "Marshmallow Fudge Treat", description: "Marshmallow topping with hot fudge, whipped cream, chocolate sprinkles and your choice of mini M&Ms or Reese's Pieces" },
  { name: "Strawberry Shortcake", description: "Warm biscuit, strawberries in strawberry sauce and whipped cream" },
];

export const oneScoopTreats: Treat[] = [
  { name: "Turtle Sundae", description: "Hot fudge and caramel topping, pecan pieces, whipped cream, nuts & a cherry" },
  { name: "Cone Head Sundae", description: "A clown made of ice cream, M&Ms, whipped cream & sprinkles, topped with a sugar cone hat" },
  { name: "Peanut Parfait", description: "Ice cream layered with hot fudge and Spanish peanuts, topped with whipped cream & a cherry" },
  { name: "Dirt N' Worms Parfait", description: "Ice cream layered with hot fudge and crushed Oreos, topped with whipped cream and gummy worms" },
];

export const bananaSplit = {
  name: "Banana Split",
  options: [
    { label: "Traditional", description: "A sliced banana with strawberry, vanilla and chocolate ice cream, strawberry, pineapple and hot fudge toppings, whipped cream, nuts & a cherry" },
    { label: "Choose-Your-Own", description: "Choose any three ice cream flavors and toppings" },
  ],
};

export const norEaster: Treat = {
  name: "Nor'Easter",
  description: "Soft serve (vanilla, chocolate or twist) blended with your choice of candy",
};
