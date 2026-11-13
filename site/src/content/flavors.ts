/**
 * Flavor menu, taken from the existing Flavors page (small typos fixed).
 * `families` are browsing filters only. They are NOT allergen labels.
 * `base` / `fleck` are display colors for the scoop illustration.
 */

export type Family =
  | "fruity"
  | "chocolate"
  | "nutty"
  | "coffee"
  | "cookies-candy"
  | "classic"
  | "spiced";

export const families: { id: Family; label: string }[] = [
  { id: "fruity", label: "Fruity" },
  { id: "chocolate", label: "Chocolate" },
  { id: "cookies-candy", label: "Cookies & Candy" },
  { id: "nutty", label: "Nutty" },
  { id: "coffee", label: "Coffee" },
  { id: "classic", label: "Classic & Custard" },
  { id: "spiced", label: "Spiced & Seasonal" },
];

export type Flavor = {
  name: string;
  description: string;
  families: Family[];
  base: string;
  fleck?: string;
  /** Named for a Maine place or tradition. */
  maineMade?: boolean;
  /** Called out on the old homepage. */
  favorite?: boolean;
};

export const iceCreams: Flavor[] = [
  { name: "Apple Pie", description: "Apple pie spiced ice cream with graham cracker crust pieces & apple", families: ["fruity", "spiced"], base: "#efd9b4", fleck: "#b9813f" },
  { name: "Bailey Island", description: "Smooth Kahlua and Bailey's (alcohol free!) Irish cream", families: ["coffee"], base: "#d9bf9f", fleck: "#8a6141", maineMade: true },
  { name: "Banana", description: "Banana ice cream made from real banana", families: ["fruity"], base: "#f6e7a8" },
  { name: "Bayville Treasure Chest", description: "Salted caramel ice cream with toffee bits", families: ["cookies-candy"], base: "#e2b77d", fleck: "#9c5f22", maineMade: true },
  { name: "Black Cherry", description: "Black cherry ice cream with black cherry pieces", families: ["fruity"], base: "#e7b3c4", fleck: "#6b1631" },
  { name: "Black Raspberry", description: "Smooth black raspberry ice cream", families: ["fruity"], base: "#b77fb0" },
  { name: "Black Raspberry Temptation", description: "Black raspberry ice cream with fudge swirls & raspberry truffles", families: ["fruity", "chocolate"], base: "#b77fb0", fleck: "#3b1f1a" },
  { name: "Blue Moon", description: "Electric blue cotton candy ice cream", families: ["cookies-candy"], base: "#7fb8e8" },
  { name: "Blueberry", description: "Blueberry ice cream with blueberry purée and Maine wild blueberries", families: ["fruity"], base: "#9b7fc8", fleck: "#3b2465", maineMade: true, favorite: true },
  { name: "Blueberry Cheesecake", description: "Cheesecake ice cream with swirls of blueberry & cheesecake chunks", families: ["fruity"], base: "#f3ead8", fleck: "#5a3e8e" },
  { name: "Bubblegum", description: "Bubblegum ice cream with bubblegum bits", families: ["cookies-candy"], base: "#f7b8d0", fleck: "#5fb3e6" },
  { name: "Butter Almond Crunch", description: "Butter almond ice cream with toffee pieces", families: ["nutty"], base: "#f0dcae", fleck: "#a8692c" },
  { name: "Butter Pecan", description: "Butter pecan ice cream with pecan pieces", families: ["nutty"], base: "#efdcb0", fleck: "#7a4a24" },
  { name: "Butterscotch Ripple", description: "Butterscotch ice cream with ribbons of caramel swirl", families: ["classic"], base: "#ecc985", fleck: "#b06f22" },
  { name: "Cake Batter", description: "Cake batter ice cream dotted with pink and purple sprinkles", families: ["cookies-candy"], base: "#f8eccf", fleck: "#c97ad8" },
  { name: "Caramel Apple", description: "Apple and cinnamon ice cream with ripples of caramel", families: ["fruity", "spiced"], base: "#eed6a8", fleck: "#b06f22" },
  { name: "Caramel Macchiato", description: "Caramel-coffee ice cream mixed with caramel & whipped cream", families: ["coffee"], base: "#d4ad83", fleck: "#9c5f22" },
  { name: "Cherry Seinfeld", description: "Chocolate-cherry ice cream with bing & maraschino cherries", families: ["chocolate", "fruity"], base: "#8b5048", fleck: "#c8102e" },
  { name: "Cherry Vanilla", description: "Cherry-red vanilla ice cream with crushed maraschino cherries", families: ["fruity", "classic"], base: "#f4c6cf", fleck: "#c8102e" },
  { name: "Chocolate", description: "Rich, smooth dark chocolate ice cream with premium cocoa", families: ["chocolate", "classic"], base: "#6b4330" },
  { name: "Chocolate Almond Joy", description: "Chocolate ice cream with crushed coconut & slivered almonds", families: ["chocolate", "nutty"], base: "#6b4330", fleck: "#f3ead8" },
  { name: "Chocolate Chip", description: "Vanilla ice cream with mini chocolate chips", families: ["chocolate", "classic"], base: "#f7efdc", fleck: "#3b2418" },
  { name: "Chocolate Fudge Oreo", description: "Chocolate ice cream with crushed Oreos and swirls of fudge", families: ["chocolate", "cookies-candy"], base: "#5e3a2a", fleck: "#1d1411", favorite: true },
  { name: "Chocolate Lover's", description: "Double-dark chocolate ice cream with ribbons of smooth peanut butter", families: ["chocolate", "nutty"], base: "#4f2f22", fleck: "#c9934d" },
  { name: "Chocolate Raspberry Truffle", description: "Chocolate ice cream with red raspberry swirls & raspberry truffles", families: ["chocolate", "fruity"], base: "#6b4330", fleck: "#c42f5a" },
  { name: "Cinnamon Ginger Snap", description: "Cinnamon ice cream with ginger snap cookie crumbles", families: ["spiced", "cookies-candy"], base: "#e6c79c", fleck: "#8f5a2a" },
  { name: "Coconut Almond Chocolate Chip", description: "Coconut ice cream with slivered almonds, chocolate chips & coconut", families: ["nutty", "chocolate"], base: "#fbf6ea", fleck: "#3b2418" },
  { name: "Coffee", description: "Bold and smooth coffee ice cream", families: ["coffee", "classic"], base: "#b88a66" },
  { name: "Coffee Heath Bar", description: "Coffee ice cream with crushed Heath bar candy", families: ["coffee", "cookies-candy"], base: "#b88a66", fleck: "#7a4a24" },
  { name: "Cookie Dough", description: "Vanilla ice cream with chocolate chips and cookie dough bits", families: ["cookies-candy"], base: "#f7efdc", fleck: "#b07a45" },
  { name: "French Maple", description: "French custard ice cream with maple", families: ["classic"], base: "#ecd09c" },
  { name: "French Vanilla", description: "Rich French custard ice cream with vanilla", families: ["classic"], base: "#f8e8b8" },
  { name: "Ginger", description: "Ginger ice cream with real crushed ginger", families: ["spiced"], base: "#f2e2b9", fleck: "#c49a3c" },
  { name: "Grapenut", description: "Sweet cream base with Grape-Nuts cereal", families: ["classic"], base: "#f4e7cc", fleck: "#a37b4b" },
  { name: "Grasshopper", description: "Mint green ice cream with crushed Oreos", families: ["cookies-candy"], base: "#bfe6c9", fleck: "#1d1411" },
  { name: "Hodgdon Hodge Podge", description: "Vanilla ice cream with fudge swirls and salted caramel truffles", families: ["chocolate", "cookies-candy"], base: "#f7efdc", fleck: "#4f2f22", maineMade: true },
  { name: "Java Chip", description: "Cappuccino ice cream with mini chocolate chips", families: ["coffee", "chocolate"], base: "#c49a77", fleck: "#3b2418" },
  { name: "Juniper Point", description: "Sea salt dark chocolate ice cream with chopped Andes mints", families: ["chocolate"], base: "#4f2f22", fleck: "#8fd3b6", maineMade: true },
  { name: "Lemon Chiffon", description: "Lightly tangy lemon custard ice cream", families: ["fruity", "classic"], base: "#f8eba0" },
  { name: "M+M", description: "Vanilla ice cream mixed with mini M&M candies", families: ["cookies-candy"], base: "#f7efdc", fleck: "#e0473b" },
  { name: "Maine Moose", description: "Vanilla ice cream with crushed Reese's cups and fudge swirls", families: ["cookies-candy", "chocolate"], base: "#f5e9cf", fleck: "#7a4a24", maineMade: true },
  { name: "Maple Walnut", description: "Maple ice cream with crushed walnuts", families: ["nutty"], base: "#e8c88d", fleck: "#7a5230" },
  { name: "Mint Chip", description: "Mint green ice cream with crushed Andes chocolate mints", families: ["chocolate"], base: "#bfe6c9", fleck: "#3b2418" },
  { name: "Mocha Chip", description: "Chocolate and coffee ice cream with mini chocolate chips", families: ["coffee", "chocolate"], base: "#94694f", fleck: "#2d1b13" },
  { name: "Mud Pie", description: "Coffee ice cream with crushed Oreos & fudge", families: ["coffee", "cookies-candy"], base: "#a37b5c", fleck: "#1d1411" },
  { name: "Orange Pineapple", description: "Orange pineapple ice cream made with crushed pineapple fruit", families: ["fruity"], base: "#f8c98a", fleck: "#f2df6b" },
  { name: "Orange Swiss Chocolate Chip", description: "Chocolate orange ice cream with mini chocolate chips", families: ["chocolate", "fruity"], base: "#b5714a", fleck: "#2d1b13" },
  { name: "Oreo", description: "Cookies and cream made with real crushed Oreos", families: ["cookies-candy"], base: "#ece6dc", fleck: "#1d1411" },
  { name: "Peach", description: "Peach ice cream with chopped peaches", families: ["fruity"], base: "#f8c9a0", fleck: "#e68a4a", favorite: true },
  { name: "Peanut Butter", description: "Smooth peanut butter ice cream", families: ["nutty"], base: "#dcb07a" },
  { name: "Peanut Butter Fantasy", description: "Peanut butter ice cream with fudge & chopped Reese's cups", families: ["nutty", "chocolate"], base: "#dcb07a", fleck: "#4f2f22", favorite: true },
  { name: "Peppermint Stick", description: "Pink peppermint ice cream with crushed peppermint candy", families: ["cookies-candy", "spiced"], base: "#f7c9d4", fleck: "#d9412f" },
  { name: "Perry's Nuthouse", description: "Hazelnut ice cream with chopped assorted nuts", families: ["nutty"], base: "#d9b88f", fleck: "#7a4a24", maineMade: true },
  { name: "Pistachio", description: "Green pistachio ice cream with chopped pistachio nuts", families: ["nutty"], base: "#cfe3a9", fleck: "#6b8a3a" },
  { name: "Pumpkin", description: "Smooth cinnamon spiced pumpkin ice cream", families: ["spiced"], base: "#eeae6c" },
  { name: "Rocky Coast", description: "Chocolate ice cream with chopped walnuts, marshmallows & Crunch candy", families: ["chocolate", "nutty"], base: "#6b4330", fleck: "#f3ead8", maineMade: true },
  { name: "Rum Raisin", description: "Rum-soaked raisins blended in rich ice cream", families: ["classic"], base: "#f1e2c2", fleck: "#5b2c3a" },
  { name: "Strawberry", description: "Strawberry ice cream with strawberry pieces", families: ["fruity", "classic"], base: "#f6b6c3", fleck: "#c42f4a" },
  { name: "Strawberry Cheesecake", description: "Strawberry cheesecake ice cream with cheesecake chunks", families: ["fruity"], base: "#f8cbd3", fleck: "#fbf6ea" },
  { name: "Vanilla", description: "Pure, smooth vanilla ice cream", families: ["classic"], base: "#fbf1d6", fleck: "#3b2418" },
  { name: "Whoopie Pie", description: "Chocolate marshmallow ice cream with whoopie pie chunks, brownie bits & vanilla frosting", families: ["chocolate", "cookies-candy"], base: "#7a5040", fleck: "#fbf6ea", maineMade: true, favorite: true },
];

/** Other frozen treats, as listed on the old Flavors page. */
export const otherTreats: { title: string; note?: string; items: string[]; color: string }[] = [
  { title: "Soft Serve", items: ["Chocolate", "Vanilla", "Twist"], color: "#f8e8b8" },
  { title: "Sherbet", items: ["Rainbow", "Orange", "Watermelon"], color: "#f8c9a0" },
  { title: "Sorbet", note: "Dairy-free", items: ["Lemon", "Mango", "Wildberry"], color: "#f6b6c3" },
  { title: "Vegan Ice Cream", note: "Homemade with oat milk", items: ["Chocolate", "Oreo Cookie", "Strawberry"], color: "#e1f4eb" },
];

/** Dietary options named on the old homepage (no specific flavors listed there). */
export const dietary = [
  "Sugar-free ice creams",
  "Low-fat frozen yogurts",
  "Fruit-forward sherbets",
  "Dairy-free vegan sorbets",
];
