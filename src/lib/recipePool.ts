export interface TrendingRecipe {
  id: string;
  title: string;
  category: string;
  time: string;
  rating: number;
  image: string;
  ingredients: string[];
  instructions: string[];
}

export const ALL_TRENDING_RECIPES: TrendingRecipe[] = [
  {
    id: '1',
    title: "Rosewater & Pistachio Macarons",
    category: "Dessert",
    time: "45m",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1569864358642-9d161970296d?q=80&w=1600&auto=format&fit=crop",
    ingredients: [
      "1 ¾ cups (210g) powdered sugar", 
      "1 cup (100g) finely ground almond flour", 
      "3 large egg whites, at room temperature", 
      "¼ cup (50g) granulated sugar", 
      "1 tsp pure rosewater extract", 
      "2-3 drops pink gel food coloring", 
      "¼ cup finely crushed roasted pistachios for topping",
      "For the filling: ½ cup unsalted butter, 1 ½ cups powdered sugar, 1 tbsp milk"
    ],
    instructions: [
      "Sift the powdered sugar and almond flour together into a large bowl. Discard any large bits that remain in the sifter.",
      "In a clean glass or metal bowl, whisk the egg whites on medium speed until foamy. Gradually add the granulated sugar while increasing speed to high.",
      "Continue whisking until stiff, glossy peaks form. Gently fold in the rosewater and pink food coloring using a spatula.",
      "Carefully fold the dry ingredients into the egg whites using the 'macaronage' technique until the batter flows like lava.",
      "Transfer the batter to a piping bag with a round tip. Pipe 1-inch circles onto a baking sheet lined with parchment paper.",
      "Tap the tray firmly on the counter to release air bubbles. Sprinkle with crushed pistachios and let rest for 30-60 minutes until a skin forms.",
      "Bake at 300°F (150°C) for 15-18 minutes. Let cool completely before filling with buttercream."
    ]
  },
  {
    id: '2',
    title: "Pink Dragonfruit Smoothie Bowl",
    category: "Breakfast",
    time: "10m",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=1600&auto=format&fit=crop",
    ingredients: [
      "1 frozen pitaya (dragonfruit) pack (approx. 100g)", 
      "1 large frozen banana, sliced", 
      "½ cup unsweetened almond milk or coconut water", 
      "1 tbsp chia seeds",
      "Toppings: Fresh raspberries, sliced kiwi, gluten-free granola, and a drizzle of honey"
    ],
    instructions: [
      "Break the frozen pitaya pack into smaller chunks and place them in a high-speed blender.",
      "Add the frozen banana slices and the almond milk. Start blending on low speed, using a tamper if necessary to push the fruit down.",
      "Increase speed to high and blend until the mixture is thick, creamy, and completely smooth.",
      "Pour the vibrant pink smoothie into a chilled bowl immediately to maintain its thick consistency.",
      "Arrange your toppings in neat rows or patterns. Start with the granola for crunch, then add the fresh fruit and chia seeds.",
      "Finish with a light drizzle of honey or agave syrup and serve immediately while still frozen."
    ]
  },
  {
    id: '3',
    title: "Strawberry Glazed Summer Salad",
    category: "Lunch",
    time: "15m",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?q=80&w=1600&auto=format&fit=crop",
    ingredients: [
      "4 cups fresh baby spinach or mixed spring greens", 
      "1 ½ cups fresh strawberries, hulled and sliced", 
      "¼ cup creamy goat cheese crumbles", 
      "¼ cup toasted pecans or slivered almonds",
      "For the glaze: 2 tbsp balsamic vinegar, 1 tbsp honey, 1 tsp dijon mustard, 3 tbsp extra virgin olive oil",
      "Optional: Thinly sliced red onion for extra bite"
    ],
    instructions: [
      "In a small jar or bowl, whisk together the balsamic vinegar, honey, and mustard. Slowly stream in the olive oil while whisking to emulsify.",
      "Place the spinach in a large salad bowl. If using red onion, toss it with the greens first.",
      "Add the sliced strawberries and toasted pecans to the bowl.",
      "Drizzle the prepared balsamic glaze over the salad and toss gently to coat the leaves without bruising the berries.",
      "Crumble the goat cheese over the top just before serving to keep it from getting too messy.",
      "Season with a pinch of flaky sea salt and freshly cracked black pepper."
    ]
  },
  {
    id: '4',
    title: "Hibiscus & Honey Roast Chicken",
    category: "Dinner",
    time: "1h 20m",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=1600&auto=format&fit=crop",
    ingredients: [
      "1 whole organic chicken (approx. 3-4 lbs)", 
      "½ cup dried hibiscus flowers", 
      "½ cup raw honey", 
      "3 cloves garlic, smashed", 
      "4 sprigs of fresh thyme",
      "2 tbsp olive oil",
      "Salt and pepper to taste"
    ],
    instructions: [
      "Preheat your oven to 375°F (190°C). Pat the chicken dry with paper towels to ensure a crispy skin.",
      "In a small saucepan, simmer the dried hibiscus flowers in ½ cup of water for 5 minutes. Strain and mix the concentrated liquid with honey and smashed garlic.",
      "Rub the chicken all over with olive oil, salt, and pepper. Stuff the cavity with fresh thyme sprigs.",
      "Place the chicken in a roasting pan and bake for 30 minutes.",
      "After 30 minutes, begin brushing the hibiscus-honey glaze over the chicken every 15-20 minutes.",
      "Continue roasting until the internal temperature reaches 165°F (74°C) and the skin is a deep, glazed pink-mahogany color.",
      "Let the chicken rest for at least 10 minutes before carving to keep the juices inside."
    ]
  },
  {
    id: '5',
    title: "Beetroot & Feta Hummus Platter",
    category: "Snack",
    time: "20m",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1541529086526-db283c563270?q=80&w=1600&auto=format&fit=crop",
    ingredients: [
      "1 can (15oz) chickpeas, drained and rinsed", 
      "1 medium beetroot, roasted until tender and peeled", 
      "3 tbsp tahini", 
      "Juice of 1 large lemon",
      "2 cloves garlic, minced",
      "¼ cup crumbled feta cheese",
      "Extra virgin olive oil and black sesame seeds for garnish"
    ],
    instructions: [
      "Place the chickpeas, roasted beetroot chunks, tahini, lemon juice, and garlic in a food processor.",
      "Process on high until the mixture is completely smooth and has turned a vibrant, deep pink color.",
      "If the hummus is too thick, add 1-2 tablespoons of cold water while the processor is running until the desired consistency is reached.",
      "Taste and season with salt and pepper as needed.",
      "Spread the hummus onto a large platter or into a shallow bowl, creating a well in the center with a spoon.",
      "Fill the well with olive oil, sprinkle with crumbled feta and black sesame seeds.",
      "Serve with warm pita bread, cucumber slices, and carrot sticks."
    ]
  },
  {
    id: '6',
    title: "Raspberry & Rosewater Sorbet",
    category: "Dessert",
    time: "15m",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=1600&auto=format&fit=crop",
    ingredients: [
      "3 cups frozen raspberries", 
      "½ cup simple syrup (or honey/maple syrup)", 
      "1 tsp high-quality rosewater",
      "1 tbsp fresh lemon juice",
      "Fresh mint leaves for garnish"
    ],
    instructions: [
      "Place the frozen raspberries in a food processor or high-speed blender.",
      "Add the simple syrup, rosewater, and lemon juice.",
      "Pulse several times to break up the berries, then blend on high until the mixture is smooth and aerated.",
      "If the berries aren't blending well, add another tablespoon of syrup or water.",
      "For a firmer consistency, transfer the sorbet to a container and freeze for 1-2 hours.",
      "Scoop into chilled glasses and garnish with a fresh mint leaf and a few extra raspberries."
    ]
  },
  {
    id: '7',
    title: "Pink Grapefruit & Avocado Salad",
    category: "Lunch",
    time: "12m",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1600&auto=format&fit=crop",
    ingredients: [
      "2 large pink grapefruits", 
      "2 ripe avocados, sliced", 
      "3 cups fresh arugula", 
      "2 tbsp toasted sunflower seeds",
      "For the dressing: 1 tbsp honey, 2 tbsp lime juice, 3 tbsp olive oil, pinch of chili flakes"
    ],
    instructions: [
      "Carefully segment the grapefruits by cutting off the peel and pith, then slicing between the membranes to release the fruit.",
      "In a small bowl, whisk together the honey, lime juice, olive oil, and chili flakes until well combined.",
      "Place the arugula in a wide, shallow bowl or on a large platter.",
      "Arrange the grapefruit segments and avocado slices over the bed of arugula.",
      "Drizzle the honey-lime dressing evenly over the salad.",
      "Sprinkle with toasted sunflower seeds for a nutty crunch and serve immediately."
    ]
  },
  {
    id: '8',
    title: "Pomegranate Glazed Salmon",
    category: "Dinner",
    time: "25m",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=1600&auto=format&fit=crop",
    ingredients: [
      "2 fresh salmon fillets (6oz each)", 
      "½ cup 100% pomegranate juice", 
      "2 tbsp honey", 
      "1 tbsp soy sauce",
      "1 tsp grated fresh ginger",
      "Fresh rosemary sprigs and pomegranate arils for garnish"
    ],
    instructions: [
      "In a small saucepan, combine the pomegranate juice, honey, soy sauce, and ginger. Simmer over medium heat until reduced by half and syrupy.",
      "Preheat your oven to 400°F (200°C). Season the salmon fillets lightly with salt and pepper.",
      "Heat an oven-safe skillet over medium-high heat with a little oil. Sear the salmon skin-side down for 3 minutes until crispy.",
      "Flip the salmon and generously brush the top with the pomegranate glaze.",
      "Transfer the skillet to the oven and roast for 5-8 minutes, or until the salmon flakes easily with a fork.",
      "Brush with one final layer of glaze before serving. Garnish with fresh rosemary and a handful of pomegranate arils."
    ]
  },
  {
    id: '9',
    title: "Watermelon & Feta Skewers",
    category: "Snack",
    time: "10m",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1563223552-30d01fda3ead?q=80&w=1600&auto=format&fit=crop",
    ingredients: [
      "2 cups seedless watermelon, cut into 1-inch cubes", 
      "1 block (7oz) firm feta cheese, cut into 1-inch cubes", 
      "Handful of fresh mint leaves", 
      "Balsamic reduction (glaze) for drizzling",
      "Small wooden skewers or toothpicks"
    ],
    instructions: [
      "Prepare the watermelon and feta by ensuring they are cut into uniform cubes for a neat presentation.",
      "On each skewer, thread one cube of watermelon, followed by a folded fresh mint leaf, and then a cube of feta cheese.",
      "Arrange the completed skewers on a serving platter.",
      "Just before serving, drizzle the balsamic reduction in a zig-zag pattern across the skewers.",
      "Keep chilled until ready to serve. These are best enjoyed fresh to prevent the watermelon from losing its crispness."
    ]
  },
  {
    id: '10',
    title: "Pink Peppercorn Crusted Tofu",
    category: "Dinner",
    time: "30m",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1600&auto=format&fit=crop",
    ingredients: [
      "1 block (14oz) extra-firm tofu", 
      "2 tbsp pink peppercorns, coarsely crushed", 
      "2 tbsp cornstarch",
      "2 tbsp soy sauce", 
      "1 tsp grated fresh ginger",
      "1 tbsp sesame oil for frying"
    ],
    instructions: [
      "Drain the tofu and wrap it in a clean kitchen towel. Place a heavy object on top for 15 minutes to press out excess moisture.",
      "Cut the pressed tofu into 1-inch cubes or thick slabs.",
      "In a shallow bowl, mix the crushed pink peppercorns with cornstarch.",
      "In another small bowl, whisk together the soy sauce and ginger. Dip each piece of tofu into the soy mixture, then dredge in the peppercorn-cornstarch mix.",
      "Heat the sesame oil in a non-stick skillet over medium-high heat.",
      "Fry the tofu pieces for 3-4 minutes per side until they are golden brown and the crust is crispy.",
      "Serve hot with steamed jasmine rice and a side of sautéed greens."
    ]
  },
  {
    id: '11',
    title: "Strawberry Basil Lemonade",
    category: "Drink",
    time: "5m",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=1600&auto=format&fit=crop",
    ingredients: [
      "2 cups fresh strawberries, hulled and halved", 
      "1 cup fresh lemon juice (approx. 4-6 lemons)", 
      "½ cup granulated sugar (adjust to taste)", 
      "4 cups cold water",
      "Handful of fresh basil leaves",
      "Ice cubes and extra strawberry slices for serving"
    ],
    instructions: [
      "In a blender, combine the strawberries, lemon juice, and sugar. Blend on high until the strawberries are completely liquefied.",
      "In a large pitcher, place the fresh basil leaves and lightly muddle them with a wooden spoon to release their aromatic oils.",
      "Pour the strawberry-lemon mixture into the pitcher over the muddled basil.",
      "Add the cold water and stir well until the sugar is fully dissolved.",
      "Taste and add more sugar or water if needed to reach your preferred sweetness and tartness level.",
      "Fill glasses with ice, pour the lemonade over, and garnish with a fresh basil sprig and a slice of strawberry."
    ]
  },
  {
    id: '12',
    title: "Roasted Radicchio with Balsamic",
    category: "Side",
    time: "20m",
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1600&auto=format&fit=crop",
    ingredients: [
      "2 medium heads of radicchio", 
      "3 tbsp extra virgin olive oil", 
      "2 tbsp high-quality balsamic vinegar", 
      "¼ cup toasted walnuts, chopped",
      "Pinch of sea salt and black pepper",
      "Optional: Shaved Parmesan cheese"
    ],
    instructions: [
      "Preheat your oven to 400°F (200°C). Line a baking sheet with parchment paper.",
      "Remove any wilted outer leaves from the radicchio and cut each head into 4 or 6 wedges, keeping the core intact so they hold together.",
      "Place the wedges on the baking sheet and drizzle generously with olive oil. Season with salt and pepper.",
      "Roast for 10-12 minutes, turning halfway through, until the edges are charred and crispy while the center is tender.",
      "Remove from the oven and immediately drizzle with balsamic vinegar while still hot.",
      "Transfer to a serving plate and sprinkle with chopped walnuts and shaved Parmesan if using."
    ]
  },
  {
    id: '13',
    title: "Pink Pasta with Roasted Garlic",
    category: "Dinner",
    time: "35m",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?q=80&w=1600&auto=format&fit=crop",
    ingredients: [
      "12oz (340g) pasta of your choice (penne or fusilli work well)", 
      "1 small beetroot, peeled and finely grated", 
      "1 head of garlic, roasted", 
      "1 cup heavy cream or coconut cream", 
      "½ cup freshly grated Parmesan cheese",
      "Fresh parsley for garnish"
    ],
    instructions: [
      "Bring a large pot of salted water to a boil. Add the grated beetroot to the water—this will turn the pasta a beautiful pink color as it cooks.",
      "Cook the pasta according to package directions until al dente. Reserve ½ cup of the pink pasta water before draining.",
      "While the pasta cooks, squeeze the roasted garlic cloves out of their skins into a small bowl and mash into a paste.",
      "In a large skillet over medium heat, combine the cream and roasted garlic paste. Simmer for 2-3 minutes until slightly thickened.",
      "Stir in the Parmesan cheese until melted and smooth. If the sauce is too thick, add a splash of the reserved pink pasta water.",
      "Add the drained pink pasta to the skillet and toss well to coat every strand in the creamy garlic sauce.",
      "Serve immediately, topped with more Parmesan and fresh parsley."
    ]
  },
  {
    id: '14',
    title: "Cherry Blossom Tea Cakes",
    category: "Dessert",
    time: "50m",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?q=80&w=1600&auto=format&fit=crop",
    ingredients: [
      "1 ½ cups all-purpose flour", 
      "1 cup granulated sugar", 
      "2 large eggs", 
      "½ cup unsalted butter, softened",
      "½ cup whole milk",
      "1 tsp cherry blossom extract (or almond extract)",
      "Pink icing: 1 cup powdered sugar, 2 tbsp milk, 1 drop pink food coloring",
      "Dried edible cherry blossom petals for decoration"
    ],
    instructions: [
      "Preheat oven to 350°F (175°C) and grease a mini cake tin or muffin tray.",
      "In a large bowl, cream together the softened butter and sugar until light and fluffy.",
      "Beat in the eggs one at a time, then stir in the cherry blossom extract.",
      "Gradually add the flour, alternating with the milk, and mix until just combined. Do not overmix.",
      "Fill the cake tins about 2/3 full and bake for 20-25 minutes until a toothpick comes out clean.",
      "Let the cakes cool completely on a wire rack.",
      "Whisk together the powdered sugar, milk, and pink coloring to make a smooth icing. Drizzle over the cooled cakes and top with dried petals."
    ]
  },
  {
    id: '15',
    title: "Shrimp Tacos with Radish Slaw",
    category: "Lunch",
    time: "20m",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1600&auto=format&fit=crop",
    ingredients: [
      "1 lb large shrimp, peeled and deveined", 
      "8 small corn tortillas", 
      "1 bunch of red radishes, julienned", 
      "1 cup shredded red cabbage",
      "Lime crema: ½ cup sour cream, juice of 1 lime, pinch of salt",
      "Taco seasoning: 1 tsp cumin, 1 tsp smoked paprika, ½ tsp garlic powder"
    ],
    instructions: [
      "In a medium bowl, toss the shrimp with the taco seasoning and a drizzle of oil.",
      "Heat a large skillet over medium-high heat. Sauté the shrimp for 2-3 minutes per side until pink and opaque.",
      "In another bowl, mix the julienned radishes and shredded cabbage with a squeeze of lime juice to make the slaw.",
      "Whisk together the sour cream and lime juice for the crema.",
      "Warm the tortillas in a dry pan or over an open flame.",
      "Assemble the tacos by placing 3-4 shrimp in each tortilla, topping with a generous amount of radish slaw, and drizzling with lime crema."
    ]
  },
  {
    id: '16',
    title: "Pink Risotto with Radicchio",
    category: "Dinner",
    time: "40m",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=1600&auto=format&fit=crop",
    ingredients: [
      "1 ½ cups Arborio rice", 
      "½ cup dry red wine (like Pinot Noir)", 
      "1 small head of radicchio, shredded", 
      "4 cups warm vegetable broth",
      "2 tbsp butter",
      "½ cup freshly grated Parmesan cheese",
      "1 small shallot, finely minced"
    ],
    instructions: [
      "In a large heavy-bottomed pot, melt 1 tablespoon of butter over medium heat. Sauté the shallot until translucent.",
      "Add the Arborio rice and cook for 2 minutes, stirring constantly, until the edges of the grains are translucent.",
      "Pour in the red wine and stir until it is completely absorbed by the rice. The wine will give the risotto a beautiful pinkish-purple hue.",
      "Begin adding the warm broth one ladleful at a time, stirring frequently. Wait until each ladle is absorbed before adding the next.",
      "Halfway through the cooking process (about 10 minutes in), stir in the shredded radicchio.",
      "Continue adding broth until the rice is tender but still has a slight bite (al dente).",
      "Remove from heat and stir in the remaining butter and Parmesan cheese. Cover and let sit for 2 minutes before serving."
    ]
  },
  {
    id: '17',
    title: "Blood Orange Tart",
    category: "Dessert",
    time: "1h",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?q=80&w=1600&auto=format&fit=crop",
    ingredients: [
      "1 pre-made shortcrust pastry shell (9-inch)", 
      "1 cup fresh blood orange juice (approx. 4-5 oranges)", 
      "3 large eggs plus 2 egg yolks", 
      "¾ cup granulated sugar",
      "½ cup heavy cream",
      "Zest of 1 blood orange"
    ],
    instructions: [
      "Preheat oven to 350°F (175°C). Blind bake the pastry shell for 15 minutes using pie weights, then remove weights and bake for another 5 minutes.",
      "In a large bowl, whisk together the eggs, egg yolks, and sugar until smooth.",
      "Stir in the blood orange juice, zest, and heavy cream until well combined.",
      "Pour the mixture into the pre-baked tart shell.",
      "Bake for 30-35 minutes, or until the filling is set but still has a slight jiggle in the center.",
      "Let the tart cool completely at room temperature, then refrigerate for at least 2 hours before slicing. Garnish with blood orange slices."
    ]
  },
  {
    id: '18',
    title: "Rhubarb & Ginger Crumble",
    category: "Dessert",
    time: "45m",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1506084868730-342b1f8505b0?q=80&w=1600&auto=format&fit=crop",
    ingredients: [
      "4 cups fresh rhubarb, chopped into 1-inch pieces", 
      "1 tbsp fresh ginger, finely grated", 
      "½ cup granulated sugar",
      "Crumble topping: 1 cup rolled oats, ½ cup all-purpose flour, ½ cup brown sugar, ½ cup cold butter, cubed"
    ],
    instructions: [
      "Preheat oven to 375°F (190°C).",
      "In a large bowl, toss the chopped rhubarb with the granulated sugar and grated ginger. Transfer the mixture to a baking dish.",
      "In another bowl, combine the oats, flour, and brown sugar. Use your fingers to rub the cold butter into the dry ingredients until it resembles coarse crumbs.",
      "Sprinkle the crumble topping evenly over the rhubarb mixture.",
      "Bake for 35-40 minutes until the rhubarb is bubbly and the topping is golden brown and crispy.",
      "Serve warm with a scoop of vanilla ice cream or a dollop of whipped cream."
    ]
  },
  {
    id: '19',
    title: "Pink Gin Fizz",
    category: "Drink",
    time: "3m",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?q=80&w=1600&auto=format&fit=crop",
    ingredients: [
      "2oz pink gin", 
      "1oz fresh lemon juice", 
      "¾oz simple syrup", 
      "1 egg white (optional, for foam)", 
      "2oz soda water",
      "Fresh raspberries for garnish"
    ],
    instructions: [
      "In a cocktail shaker, combine the pink gin, lemon juice, simple syrup, and egg white.",
      "Perform a 'dry shake' (without ice) for 15 seconds to emulsify the egg white and create a thick foam.",
      "Add a handful of ice to the shaker and shake again for another 15 seconds until well-chilled.",
      "Double strain the mixture into a chilled highball glass or Collins glass.",
      "Top with soda water—the foam will rise to the top.",
      "Garnish with a few fresh raspberries or a lemon twist."
    ]
  },
  {
    id: '20',
    title: "Roasted Beet & Goat Cheese Crostini",
    category: "Appetizer",
    time: "25m",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1541529086526-db283c563270?q=80&w=1600&auto=format&fit=crop",
    ingredients: [
      "1 French baguette, sliced into ½-inch rounds", 
      "2 medium beets, roasted and sliced", 
      "4oz creamy goat cheese", 
      "2 tbsp honey", 
      "1 tsp fresh thyme leaves",
      "Olive oil for brushing"
    ],
    instructions: [
      "Preheat oven to 400°F (200°C). Brush the baguette slices with olive oil and toast for 5-7 minutes until golden.",
      "Spread a generous layer of goat cheese onto each toasted baguette slice.",
      "Place a slice of roasted beet on top of the cheese.",
      "Drizzle each crostini with a little bit of honey.",
      "Sprinkle with fresh thyme leaves and a pinch of sea salt.",
      "Serve immediately as a sophisticated and colorful appetizer."
    ]
  },
  {
    id: '21',
    title: "Pink Potato Salad",
    category: "Side",
    time: "30m",
    rating: 4.1,
    image: "https://images.unsplash.com/photo-1546793665-c74683c3f43d?q=80&w=1600&auto=format&fit=crop",
    ingredients: [
      "2 lbs red potatoes, scrubbed and cubed", 
      "1 small beet, peeled and grated (for color)", 
      "½ cup mayonnaise", 
      "1 tbsp Dijon mustard",
      "2 tbsp fresh dill, chopped",
      "¼ cup red onion, finely diced",
      "2 hard-boiled eggs, chopped"
    ],
    instructions: [
      "Place the cubed potatoes in a large pot of salted water. Bring to a boil and cook for 10-12 minutes until tender but not mushy.",
      "In the last 2 minutes of boiling, add the grated beet to the water. This will dye the potatoes a soft pink hue.",
      "Drain the potatoes and beet, then let them cool to room temperature.",
      "In a large bowl, whisk together the mayonnaise, mustard, and chopped dill.",
      "Add the cooled potatoes, red onion, and hard-boiled eggs to the bowl.",
      "Gently toss until everything is evenly coated in the dressing. Season with salt and pepper to taste.",
      "Refrigerate for at least 1 hour before serving to allow the flavors to meld."
    ]
  },
  {
    id: '22',
    title: "Strawberry Chia Pudding",
    category: "Breakfast",
    time: "5m",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=1600&auto=format&fit=crop",
    ingredients: [
      "¼ cup chia seeds", 
      "1 cup unsweetened almond milk", 
      "1 tbsp maple syrup", 
      "½ tsp vanilla extract",
      "½ cup fresh strawberries, mashed",
      "Extra strawberries and granola for topping"
    ],
    instructions: [
      "In a mason jar or bowl, combine the chia seeds, almond milk, maple syrup, and vanilla extract.",
      "Stir in the mashed strawberries until the mixture is a pretty pink color.",
      "Whisk well to ensure there are no clumps of chia seeds.",
      "Cover and refrigerate for at least 4 hours, or preferably overnight, until the mixture has thickened into a pudding consistency.",
      "Give the pudding a good stir before serving.",
      "Top with fresh strawberry slices and a sprinkle of granola for a healthy and vibrant breakfast."
    ]
  },
  {
    id: '23',
    title: "Pink Velvet Cupcakes",
    category: "Dessert",
    time: "40m",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?q=80&w=1600&auto=format&fit=crop",
    ingredients: [
      "1 ½ cups all-purpose flour", 
      "1 tsp cocoa powder", 
      "1 cup granulated sugar", 
      "¾ cup vegetable oil",
      "1 large egg",
      "½ cup buttermilk",
      "1 tsp vanilla extract",
      "Pink gel food coloring",
      "Cream cheese frosting: 8oz cream cheese, ½ cup butter, 3 cups powdered sugar"
    ],
    instructions: [
      "Preheat oven to 350°F (175°C) and line a cupcake tin with paper liners.",
      "In a medium bowl, whisk together the flour, cocoa powder, and a pinch of salt.",
      "In a large bowl, beat the sugar and oil together. Add the egg, buttermilk, vanilla, and pink food coloring. Mix until the color is vibrant and even.",
      "Gradually add the dry ingredients to the wet ingredients, mixing until just combined.",
      "Fill each cupcake liner about 2/3 full.",
      "Bake for 18-22 minutes until a toothpick comes out clean. Let cool completely on a wire rack.",
      "Beat the cream cheese and butter until smooth, then gradually add powdered sugar. Pipe generous swirls of frosting onto the cooled cupcakes."
    ]
  },
  {
    id: '24',
    title: "Hibiscus Poached Pears",
    category: "Dessert",
    time: "45m",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1541014741259-df529411b96a?q=80&w=1600&auto=format&fit=crop",
    ingredients: [
      "4 firm Bosc pears, peeled but with stems intact", 
      "4 cups water", 
      "½ cup dried hibiscus flowers", 
      "1 cup granulated sugar",
      "1 cinnamon stick",
      "2 whole star anise",
      "1 tsp vanilla bean paste"
    ],
    instructions: [
      "In a large saucepan, combine the water, hibiscus flowers, sugar, cinnamon stick, and star anise. Bring to a boil, then reduce to a simmer.",
      "Carefully place the peeled pears into the poaching liquid. Ensure they are mostly submerged.",
      "Simmer the pears for 20-30 minutes, turning occasionally, until they are tender when pierced with a knife and have turned a deep ruby pink.",
      "Remove the pears from the liquid and set aside.",
      "Increase the heat and boil the poaching liquid for 10-15 minutes until it reduces into a thick, syrupy glaze.",
      "Serve the pears warm or chilled, drizzled with the hibiscus syrup and a dollop of mascarpone or vanilla cream."
    ]
  },
  {
    id: '25',
    title: "Pink Hummus Wrap",
    category: "Lunch",
    time: "10m",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1540713434306-58505cf1b6fc?q=80&w=1600&auto=format&fit=crop",
    ingredients: [
      "1 large flour or spinach tortilla", 
      "½ cup beetroot hummus", 
      "1 cup fresh baby spinach", 
      "½ cucumber, thinly sliced", 
      "¼ cup crumbled feta cheese",
      "Optional: Pickled red onions for extra tang"
    ],
    instructions: [
      "Lay the tortilla flat on a clean surface.",
      "Spread the beetroot hummus evenly over the center of the tortilla, leaving a 1-inch border.",
      "Layer the fresh baby spinach over the hummus.",
      "Arrange the cucumber slices and pickled red onions on top of the spinach.",
      "Sprinkle the crumbled feta cheese over the vegetables.",
      "Fold in the sides of the tortilla and roll it up tightly from the bottom.",
      "Slice the wrap in half diagonally and serve immediately."
    ]
  },
  {
    id: '26',
    title: "Rose Petal Jam",
    category: "Other",
    time: "1h",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1589927946926-0649779339e1?q=80&w=1600&auto=format&fit=crop",
    ingredients: [
      "2 cups organic, pesticide-free pink rose petals", 
      "2 cups granulated sugar", 
      "2 tbsp fresh lemon juice", 
      "1 cup water",
      "1 tsp fruit pectin (optional, for thicker consistency)"
    ],
    instructions: [
      "Gently wash the rose petals and pat them dry with a paper towel. Remove the white base of each petal as it can be bitter.",
      "In a medium saucepan, combine the water, sugar, and lemon juice. Bring to a simmer over medium heat, stirring until the sugar dissolves.",
      "Add the rose petals to the syrup. They will wilt and lose some color initially.",
      "Simmer gently for 30-40 minutes. The liquid will gradually turn a beautiful pink and thicken.",
      "If using pectin, whisk it in during the last 5 minutes of simmering.",
      "Pour the hot jam into sterilized glass jars. Let cool completely before sealing and refrigerating."
    ]
  },
  {
    id: '27',
    title: "Pink Cauliflower Steaks",
    category: "Dinner",
    time: "35m",
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1600&auto=format&fit=crop",
    ingredients: [
      "1 large head of cauliflower", 
      "1 cup beetroot juice (for marinade)", 
      "2 cloves garlic, minced", 
      "3 tbsp olive oil",
      "1 tsp smoked paprika",
      "Fresh parsley for garnish"
    ],
    instructions: [
      "Preheat your oven to 400°F (200°C). Line a baking sheet with parchment paper.",
      "Remove the leaves and trim the stem of the cauliflower. Slice the head into 1-inch thick 'steaks'.",
      "In a shallow dish, whisk together the beetroot juice, minced garlic, olive oil, and smoked paprika.",
      "Carefully dip each cauliflower steak into the beet marinade, ensuring both sides are well-coated and have turned pink.",
      "Place the steaks on the baking sheet and roast for 25-30 minutes, turning halfway through, until tender and slightly charred at the edges.",
      "Garnish with fresh parsley and serve as a vibrant plant-based main course."
    ]
  },
  {
    id: '28',
    title: "Strawberry Spinach Smoothie",
    category: "Drink",
    time: "5m",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?q=80&w=1600&auto=format&fit=crop",
    ingredients: [
      "1 ½ cups fresh strawberries, hulled", 
      "1 cup fresh baby spinach", 
      "1 cup Greek yogurt (plain or vanilla)", 
      "1 tbsp honey or maple syrup",
      "½ cup cold water or milk of choice"
    ],
    instructions: [
      "Place the strawberries, spinach, Greek yogurt, and sweetener into a high-speed blender.",
      "Add the cold water or milk.",
      "Blend on high until the mixture is completely smooth and creamy.",
      "If the smoothie is too thick, add a little more liquid and blend again.",
      "Pour into a tall glass and enjoy immediately for a nutrient-packed start to your day."
    ]
  },
  {
    id: '29',
    title: "Pink Deviled Eggs",
    category: "Appetizer",
    time: "20m",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1546793665-c74683c3f43d?q=80&w=1600&auto=format&fit=crop",
    ingredients: [
      "6 large hard-boiled eggs, peeled", 
      "1 cup beetroot juice", 
      "3 tbsp mayonnaise", 
      "1 tsp Dijon mustard",
      "Pinch of smoked paprika",
      "Fresh chives for garnish"
    ],
    instructions: [
      "Place the peeled hard-boiled eggs in a bowl and cover them with beetroot juice. Let them soak for 30-60 minutes until the whites turn a vibrant pink.",
      "Remove the eggs from the juice and pat dry. Slice each egg in half lengthwise.",
      "Carefully scoop out the yolks and place them in a small bowl.",
      "Mash the yolks with mayonnaise, Dijon mustard, and smoked paprika until smooth and creamy.",
      "Pipe or spoon the yolk mixture back into the pink egg white halves.",
      "Garnish with a sprinkle of extra paprika and chopped fresh chives."
    ]
  },
  {
    id: '30',
    title: "Raspberry White Chocolate Blondies",
    category: "Dessert",
    time: "40m",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?q=80&w=1600&auto=format&fit=crop",
    ingredients: [
      "1 cup unsalted butter, melted and cooled", 
      "1 cup light brown sugar, packed", 
      "1 large egg plus 1 egg yolk", 
      "2 tsp vanilla extract",
      "2 cups all-purpose flour",
      "1 cup white chocolate chips",
      "1 cup fresh raspberries"
    ],
    instructions: [
      "Preheat oven to 350°F (175°C) and grease an 8x8 inch baking pan.",
      "In a large bowl, whisk together the melted butter and brown sugar until smooth.",
      "Add the egg, egg yolk, and vanilla extract. Whisk until well combined.",
      "Gently fold in the flour until just a few streaks remain.",
      "Stir in the white chocolate chips and fresh raspberries. Be careful not to overmix or crush the berries too much.",
      "Spread the batter evenly into the prepared pan.",
      "Bake for 25-30 minutes until the edges are golden brown and the center is set. Let cool completely before slicing into squares."
    ]
  },
  {
    id: '31',
    title: "Pink Couscous Salad",
    category: "Lunch",
    time: "15m",
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1600&auto=format&fit=crop",
    ingredients: [
      "1 cup dry couscous", 
      "1 cup boiling vegetable broth mixed with 2 tbsp beetroot juice", 
      "1 can (15oz) chickpeas, rinsed", 
      "½ cup fresh parsley, chopped", 
      "Juice of 1 large lemon",
      "2 tbsp extra virgin olive oil",
      "¼ cup pomegranate arils for garnish"
    ],
    instructions: [
      "Place the dry couscous in a large heat-proof bowl.",
      "Pour the boiling pink beet broth over the couscous. Cover immediately and let sit for 5-10 minutes until the liquid is fully absorbed.",
      "Fluff the couscous with a fork to separate the grains—they should be a beautiful light pink.",
      "Add the chickpeas, chopped parsley, lemon juice, and olive oil to the bowl.",
      "Toss gently to combine all ingredients.",
      "Garnish with pomegranate arils and serve at room temperature or chilled."
    ]
  },
  {
    id: '32',
    title: "Strawberry Balsamic Bruschetta",
    category: "Appetizer",
    time: "15m",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1572656631137-7935297eff55?q=80&w=1600&auto=format&fit=crop",
    ingredients: [
      "1 French baguette, sliced into ½-inch rounds", 
      "2 cups fresh strawberries, hulled and finely diced", 
      "¼ cup high-quality balsamic glaze", 
      "Handful of fresh basil leaves, chiffonade",
      "4oz creamy goat cheese or ricotta",
      "Olive oil for brushing"
    ],
    instructions: [
      "Preheat your oven to 400°F (200°C). Brush the baguette slices with olive oil and toast for 5-7 minutes until crispy and golden.",
      "In a small bowl, toss the diced strawberries with half of the balsamic glaze and the fresh basil.",
      "Spread a layer of goat cheese or ricotta onto each warm baguette slice.",
      "Top with a generous spoonful of the strawberry-basil mixture.",
      "Drizzle the remaining balsamic glaze over the top just before serving.",
      "Enjoy as a fresh, sweet, and savory appetizer."
    ]
  },
  {
    id: '33',
    title: "Pink Lemonade Sorbet",
    category: "Dessert",
    time: "10m",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=1600&auto=format&fit=crop",
    ingredients: [
      "1 cup fresh lemon juice", 
      "¾ cup granulated sugar", 
      "¼ cup fresh raspberry juice (for that perfect pink color)", 
      "2 cups cold water",
      "1 tbsp lemon zest"
    ],
    instructions: [
      "In a small saucepan, combine the sugar and 1 cup of the water. Heat over medium heat until the sugar is completely dissolved to create a simple syrup.",
      "Remove from heat and let cool.",
      "In a large bowl, whisk together the simple syrup, lemon juice, raspberry juice, lemon zest, and the remaining cup of water.",
      "Pour the mixture into an ice cream maker and churn according to the manufacturer's instructions until it reaches a firm sorbet consistency.",
      "Transfer to a freezer-safe container and freeze for at least 3 hours before serving.",
      "Scoop into chilled glasses and garnish with a lemon twist."
    ]
  },
  {
    id: '34',
    title: "Roasted Beet & Quinoa Bowl",
    category: "Lunch",
    time: "30m",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1600&auto=format&fit=crop",
    ingredients: [
      "1 cup dry quinoa", 
      "2 medium beets, roasted and cubed", 
      "2 cups fresh baby kale or spinach", 
      "¼ cup toasted pumpkin seeds",
      "Creamy tahini dressing: 2 tbsp tahini, 1 tbsp lemon juice, 1 tsp maple syrup, water to thin"
    ],
    instructions: [
      "Cook the quinoa according to package directions. For extra flavor, cook it in vegetable broth.",
      "While the quinoa is still warm, toss it with the roasted beet cubes. The beets will bleed slightly, giving the quinoa a lovely pink tint.",
      "In a small bowl, whisk together the tahini, lemon juice, and maple syrup. Add water a teaspoon at a time until it reaches a pourable consistency.",
      "Place a bed of kale or spinach in each bowl.",
      "Top with the pink quinoa and beet mixture.",
      "Drizzle with the tahini dressing and sprinkle with toasted pumpkin seeds."
    ]
  },
  {
    id: '35',
    title: "Pink Pancakes",
    category: "Breakfast",
    time: "20m",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?q=80&w=1600&auto=format&fit=crop",
    ingredients: [
      "1 ½ cups all-purpose flour", 
      "2 tbsp granulated sugar", 
      "1 tbsp baking powder", 
      "1 cup whole milk",
      "1 large egg",
      "¼ cup beetroot puree (roasted and blended beets)",
      "Fresh strawberries and whipped cream for topping"
    ],
    instructions: [
      "In a large bowl, whisk together the flour, sugar, and baking powder.",
      "In another bowl, whisk together the milk, egg, and beetroot puree until smooth and vibrant pink.",
      "Pour the wet ingredients into the dry ingredients and stir until just combined. A few lumps are okay.",
      "Heat a lightly greased griddle or non-stick skillet over medium heat.",
      "Pour ¼ cup of batter for each pancake onto the griddle.",
      "Cook until bubbles form on the surface, then flip and cook for another 1-2 minutes until golden.",
      "Serve warm, topped with fresh strawberries and a dollop of whipped cream."
    ]
  },
  {
    id: '36',
    title: "Watermelon Gazpacho",
    category: "Lunch",
    time: "15m",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=1600&auto=format&fit=crop",
    ingredients: [
      "4 cups seedless watermelon, cubed", 
      "1 small cucumber, peeled and chopped", 
      "1 red bell pepper, chopped", 
      "1 small red onion, finely diced",
      "2 tbsp lime juice",
      "1 tbsp olive oil",
      "Fresh mint and feta for garnish"
    ],
    instructions: [
      "Place the watermelon, cucumber, and bell pepper in a blender.",
      "Pulse until the mixture is broken down but still has some texture (don't over-blend into a juice).",
      "Pour the mixture into a large bowl and stir in the diced red onion, lime juice, and olive oil.",
      "Season with a pinch of salt and pepper.",
      "Refrigerate for at least 1 hour to allow the flavors to develop and the soup to chill completely.",
      "Serve in chilled bowls, garnished with fresh mint leaves and a sprinkle of crumbled feta."
    ]
  },
  {
    id: '37',
    title: "Pink Rice Paper Rolls",
    category: "Appetizer",
    time: "25m",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=1600&auto=format&fit=crop",
    ingredients: [
      "12 rice paper wraps", 
      "2 cups vermicelli noodles, cooked in water with 2 tbsp beet juice", 
      "1 lb large shrimp, cooked and halved lengthwise", 
      "Handful of fresh mint and cilantro leaves",
      "Peanut dipping sauce"
    ],
    instructions: [
      "Prepare a large bowl of warm water.",
      "Dip one rice paper wrap into the water for 5-10 seconds until pliable, then lay flat on a clean surface.",
      "Place 3 shrimp halves in a row across the center of the wrap.",
      "Top with a small handful of the pink vermicelli noodles and a few fresh herb leaves.",
      "Fold the bottom of the wrap over the filling, then fold in the sides and roll up tightly.",
      "Repeat with the remaining ingredients and serve with peanut dipping sauce."
    ]
  },
  {
    id: '38',
    title: "Strawberry Mousse",
    category: "Dessert",
    time: "20m",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=1600&auto=format&fit=crop",
    ingredients: [
      "2 cups fresh strawberries, hulled", 
      "1 cup heavy whipping cream, chilled", 
      "½ cup powdered sugar", 
      "1 tsp vanilla extract",
      "1 packet (7g) unflavored gelatin dissolved in 2 tbsp water"
    ],
    instructions: [
      "Puree the strawberries in a blender until completely smooth.",
      "In a large bowl, whip the heavy cream with powdered sugar and vanilla until stiff peaks form.",
      "Gently fold the strawberry puree into the whipped cream.",
      "Slowly stir in the dissolved gelatin until well incorporated.",
      "Spoon the mousse into individual serving glasses.",
      "Refrigerate for at least 2 hours until set. Garnish with a fresh strawberry before serving."
    ]
  },
  {
    id: '39',
    title: "Pink Grapefruit Sorbet",
    category: "Dessert",
    time: "15m",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=1600&auto=format&fit=crop",
    ingredients: [
      "2 cups fresh pink grapefruit juice", 
      "¾ cup granulated sugar", 
      "1 cup water", 
      "1 tbsp grapefruit zest"
    ],
    instructions: [
      "Combine the sugar and water in a saucepan and heat until the sugar is dissolved. Let cool.",
      "Stir in the grapefruit juice and zest.",
      "Pour the mixture into an ice cream maker and churn until thick and frozen.",
      "Transfer to a container and freeze for 2-4 hours until firm.",
      "Serve in chilled bowls for a refreshing and tart dessert."
    ]
  },
  {
    id: '40',
    title: "Roasted Salmon with Pink Peppercorns",
    category: "Dinner",
    time: "20m",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=1600&auto=format&fit=crop",
    ingredients: [
      "2 salmon fillets (6oz each)", 
      "2 tbsp pink peppercorns, coarsely crushed", 
      "1 large lemon, sliced", 
      "2 tbsp fresh dill, chopped",
      "1 tbsp olive oil"
    ],
    instructions: [
      "Preheat your oven to 400°F (200°C).",
      "Place the salmon fillets on a parchment-lined baking sheet.",
      "Brush the salmon with olive oil and press the crushed pink peppercorns onto the top of each fillet.",
      "Arrange lemon slices around the salmon.",
      "Roast for 12-15 minutes until the salmon is cooked through and flakes easily.",
      "Sprinkle with fresh dill and serve immediately."
    ]
  },
  {
    id: '41',
    title: "Pink Potato Gnocchi",
    category: "Dinner",
    time: "1h",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1473093226795-af9932fe5855?q=80&w=1600&auto=format&fit=crop",
    ingredients: [
      "2 lbs Russet potatoes", 
      "½ cup beetroot puree", 
      "2 cups all-purpose flour", 
      "1 large egg",
      "Sage butter sauce: ½ cup butter, 10 fresh sage leaves"
    ],
    instructions: [
      "Boil the potatoes until tender, then peel and mash while still warm.",
      "Mix the mashed potatoes with the beetroot puree until the color is uniform.",
      "Add the egg and gradually incorporate the flour until a soft dough forms.",
      "Roll the dough into long ropes and cut into 1-inch pieces.",
      "Boil the gnocchi in salted water until they float to the surface.",
      "Sauté the gnocchi in a pan with melted butter and sage leaves until slightly crispy."
    ]
  },
  {
    id: '42',
    title: "Strawberry Rhubarb Pie",
    category: "Dessert",
    time: "1h 30m",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?q=80&w=1600&auto=format&fit=crop",
    ingredients: [
      "3 cups fresh strawberries, sliced", 
      "3 cups rhubarb, chopped", 
      "1 cup granulated sugar", 
      "¼ cup cornstarch",
      "Double pie crust (top and bottom)"
    ],
    instructions: [
      "Preheat oven to 400°F (200°C).",
      "In a large bowl, toss the strawberries and rhubarb with sugar and cornstarch.",
      "Line a pie dish with the bottom crust and fill with the fruit mixture.",
      "Cover with the top crust, seal the edges, and cut a few slits for steam to escape.",
      "Bake for 45-55 minutes until the crust is golden and the filling is bubbly.",
      "Let cool completely before slicing to allow the filling to set."
    ]
  },
  {
    id: '43',
    title: "Pink Tabbouleh",
    category: "Side",
    time: "20m",
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1600&auto=format&fit=crop",
    ingredients: [
      "1 cup fine bulgur wheat", 
      "1 cup boiling water mixed with 2 tbsp beet juice", 
      "2 cups fresh parsley, finely chopped", 
      "1 large tomato, diced",
      "Juice of 2 lemons",
      "¼ cup olive oil"
    ],
    instructions: [
      "Soak the bulgur in the boiling pink beet water for 15 minutes until tender.",
      "Drain any excess liquid and fluff with a fork.",
      "In a large bowl, combine the pink bulgur, chopped parsley, and diced tomato.",
      "Whisk together the lemon juice and olive oil, then pour over the salad.",
      "Toss well and season with salt and pepper. Serve chilled."
    ]
  },
  {
    id: '44',
    title: "Raspberry Chia Jam",
    category: "Other",
    time: "10m",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1589927946926-0649779339e1?q=80&w=1600&auto=format&fit=crop",
    ingredients: [
      "2 cups fresh or frozen raspberries", 
      "2 tbsp chia seeds", 
      "2 tbsp honey or maple syrup", 
      "1 tsp vanilla extract"
    ],
    instructions: [
      "In a small saucepan, heat the raspberries over medium heat until they break down and become saucy.",
      "Remove from heat and mash the berries with a fork.",
      "Stir in the chia seeds, sweetener, and vanilla extract.",
      "Let the mixture sit for 10 minutes until the chia seeds absorb the liquid and thicken it into a jam.",
      "Transfer to a jar and refrigerate. It will continue to thicken as it cools."
    ]
  },
  {
    id: '45',
    title: "Pink Cauliflower Soup",
    category: "Lunch",
    time: "30m",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=1600&auto=format&fit=crop",
    ingredients: [
      "1 large head of cauliflower, chopped", 
      "1 small beet, peeled and chopped", 
      "1 small yellow onion, diced", 
      "4 cups vegetable broth",
      "½ cup heavy cream or coconut milk"
    ],
    instructions: [
      "In a large pot, sauté the onion until translucent.",
      "Add the cauliflower, beet, and vegetable broth. Bring to a boil, then simmer for 20 minutes until the vegetables are tender.",
      "Use an immersion blender to puree the soup until completely smooth and vibrant pink.",
      "Stir in the cream or coconut milk for added richness.",
      "Season with salt and pepper and serve hot with a swirl of extra cream."
    ]
  },
  {
    id: '46',
    title: "Strawberry Salsa",
    category: "Appetizer",
    time: "10m",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1600&auto=format&fit=crop",
    ingredients: [
      "2 cups fresh strawberries, finely diced", 
      "1 small jalapeno, seeded and minced", 
      "¼ cup red onion, finely diced", 
      "¼ cup fresh cilantro, chopped",
      "Juice of 1 lime"
    ],
    instructions: [
      "In a medium bowl, combine the diced strawberries, jalapeno, red onion, and cilantro.",
      "Squeeze the lime juice over the mixture and toss gently to combine.",
      "Let the salsa sit for 10 minutes to allow the flavors to meld.",
      "Serve with cinnamon-sugar pita chips or as a topping for grilled chicken or fish."
    ]
  },
  {
    id: '47',
    title: "Pink Coconut Macaroons",
    category: "Dessert",
    time: "30m",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1569864358642-9d161970296d?q=80&w=1600&auto=format&fit=crop",
    ingredients: [
      "3 cups sweetened shredded coconut", 
      "3 large egg whites", 
      "½ cup granulated sugar", 
      "1 tsp vanilla extract",
      "1-2 drops pink gel food coloring"
    ],
    instructions: [
      "Preheat oven to 325°F (165°C) and line a baking sheet with parchment paper.",
      "In a large bowl, whisk the egg whites until foamy. Add the sugar, vanilla, and pink food coloring and whisk until combined.",
      "Fold in the shredded coconut until evenly coated and pink.",
      "Scoop rounded tablespoons of the mixture onto the baking sheet.",
      "Bake for 20-25 minutes until the edges are just starting to brown and the macaroons are set.",
      "Let cool completely on the baking sheet before removing."
    ]
  },
  {
    id: '48',
    title: "Roasted Radishes with Butter",
    category: "Side",
    time: "20m",
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1600&auto=format&fit=crop",
    ingredients: [
      "2 bunches of radishes, halved", 
      "2 tbsp unsalted butter, melted", 
      "1 tsp fresh thyme leaves", 
      "Flaky sea salt to taste"
    ],
    instructions: [
      "Preheat oven to 425°F (220°C).",
      "Toss the halved radishes with melted butter and thyme on a baking sheet.",
      "Arrange them cut-side down for maximum caramelization.",
      "Roast for 15-20 minutes until tender and the skins are a vibrant, slightly charred pink.",
      "Sprinkle with flaky sea salt and serve warm as a unique and colorful side dish."
    ]
  },
  {
    id: '49',
    title: "Pink Grapefruit Margarita",
    category: "Drink",
    time: "5m",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?q=80&w=1600&auto=format&fit=crop",
    ingredients: [
      "2oz silver tequila", 
      "2oz fresh pink grapefruit juice", 
      "1oz fresh lime juice", 
      "½oz agave nectar",
      "Salt for the rim and a grapefruit wedge for garnish"
    ],
    instructions: [
      "Rim a glass with salt by rubbing a lime wedge around the edge and dipping it into a small plate of salt.",
      "In a cocktail shaker filled with ice, combine the tequila, grapefruit juice, lime juice, and agave nectar.",
      "Shake vigorously for 15-20 seconds until well-chilled.",
      "Strain into the prepared glass over fresh ice.",
      "Garnish with a grapefruit wedge and enjoy a refreshing, citrusy cocktail."
    ]
  },
  {
    id: '50',
    title: "Strawberry White Chocolate Cookies",
    category: "Dessert",
    time: "25m",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?q=80&w=1600&auto=format&fit=crop",
    ingredients: [
      "1 cup unsalted butter, softened", 
      "1 cup granulated sugar", 
      "2 large eggs", 
      "2 cups all-purpose flour",
      "1 cup white chocolate chips",
      "½ cup freeze-dried strawberries, crushed"
    ],
    instructions: [
      "Preheat oven to 350°F (175°C).",
      "Cream together the butter and sugar until light and fluffy.",
      "Beat in the eggs one at a time.",
      "Gradually add the flour and mix until combined.",
      "Fold in the white chocolate chips and crushed freeze-dried strawberries.",
      "Drop rounded tablespoons of dough onto a baking sheet and bake for 10-12 minutes.",
      "Cool on a wire rack and enjoy these pretty pink-speckled cookies."
    ]
  }
];
