var recipeSeed = [{
  name: "Aussie Meat Pie",
  ingredients: [
   "1 tablespoon olive oil",
   "1 large brown onion, finely chopped",
   "500g lean beef mince",
   "1 tablespoon cornflour",
   "3/4 cup Campbell's Real Stock Beef",
   "3/4 cup tomato sauce",
   "2 tablespoons Worcestershire sauce",
   "1 tablespoon barbecue sauce",
   "1 teaspoon Vegemite",
   "2 sheets frozen shortcrust pastry, thawed",
   "2 sheets frozen puff pastry, thawed",
   "1 egg, beaten"
  ],
  directions: "Step 1\nHeat oil in a saucepan over medium-high heat. Add onion. Cook for 3 minutes or until soft. Add mince. Cook for 4 minutes, stirring with a wooden spoon, or until browned.\nStep 2\nMix cornflour and 1 tablespoon of stock to form a paste. Add remaining stock. Add stock, sauces and Vegemite to mince. Bring to the boil. Reduce heat to medium-low. Simmer for 8 minutes or until thick. Cool.\nStep 3\nPreheat oven to 220°C. Place a baking tray into oven. Grease 4 x 8cm base measurement pie pans.\nStep 4\nCut 4 x 15cm circles from shortcrust pastry. Use to line bases and sides of pans. Fill with mince. Brush rims with water. Cut 4 x 15cm circles from puff pastry. Place over meat. Press to seal. Trim. Brush with egg. Season.\nStep 5\nPlace pies onto hot tray. Bake for 20 to 25 minutes or until golden. Serve"
  }, 
  {
  name: 'Pizza Dough',
  ingredients: [
    "1 package active dry or fresh yeast",
    "1 teaspoon honey",
    "1 cup warm water, 105 to 115 degrees F",
    "3 cups all-purpose flour",
    "1 teaspoon kosher salt",
    "1 tablespoon extra-virgin olive oil, plus additional for brushing"
  ],
  directions: "In a small bowl, dissolve the yeast and honey in 1/4 cup warm water.\nIn a food processor, combine the flour and the salt. Add the oil, the yeast mixture, and the remaining 3/4 cup of water and process until the mixture forms a ball. (The pizza dough can also be made in a mixer fitted with a dough hook. Mix on low speed until the mixture comes cleanly away from the sides of the bowl and starts to climb up the dough hook).\nTurn the dough out onto a clean work surface and knead by hand 2 or 3 minutes longer. The dough should be smooth and firm. Cover the dough with a clean, damp towel and let it rise in a cool spot for about 2 hours. (When ready, the dough will stretch as it is lightly pulled).\nDivide the dough into 4 balls, about 6 ounces each. Work each ball by pulling down the sides and tucking under the bottom of the ball. Repeat 4 or 5 times. Then on a smooth, unfloured surface, roll the ball under the palm of your hand until the top of the dough is smooth and firm, about 1 minute. Cover the dough with a damp towel and let rest 1 hour. At this point, the balls can be wrapped in plastic and refrigerated for up to 2 days."
},
  {
  name:'Swedish Pancakes',
  ingredients: ["3 C. all-purpose flour",
    "3/4 tsp. kosher salt",
    "1 Tbs. brown sugar, packed",
    "4 C. milk",
    "4 large eggs",
    "1 tsp. vanilla extract",
    "2 Tbs. butter, melted",
    "Powdered sugar for dusting",
    "1 C. fruit preserves or jam (blueberry, raspberry, and cherry are nice)",
    "2 Tbs. (or more) water"
    ],
    directions: 'For the Pancakes:\nPreheat the oven to 200 degrees (F) and place a half-sheet pan into the oven.\nIn a large bowl, measure flour, salt, and brown sugar. Whisk to distribute.\nAdd the eggs, vanilla, and milk to the flour mixture.  Briskly whisk until smooth and blended.\nPour the melted butter into the batter, and whisk to further combine.\nHeat a 10-inch skillet over medium-high heat.\nOnce skillet is hot, swirl a half stick of cold butter around the pan to coat.\nPour about ¼ cup of batter into the greased pan. Tilt the pan in all directions to evenly distribute batter.\nCook pancake for about a minute or until edges dry and begin to curl upward.\nRun a spatula around the edges of the pancake to loosen.\nGet the spatula under most of the pancake, and flip it quickly, trying to keep it from folding.\nContinue cooking the other side for about 30 seconds, or until slightly browned.\nRemove pancake and put it on the warmed sheet pan. Run the stick of butter over top of the hot pancake to butter it, and then put the sheet pan back in the oven to keep it warm.\nRepeat the butter/batter/cooking/flipping/warming process until all of the batter has been used.\nFor the fruit sauce:\n\nPlace the preserves/jam into a small bowl.\nPour a few tablespoons of water over the preserves, and then whisk to combine.\nMore water can be added, depending on the desired consistency of the sauce.\nPlace sauce in a gravy pitcher, or plastic squirt bottle and serve alongside pancakes.\nPancakes can be served sprinkled with powdered sugar & rolled up, filled with fruit, or flat with a\ndollop of Greek yogurt and fruit sauce.'
  }]
// localStorage.setItem('recipes', [JSON.stringify(recipeSeed)])
var Modal = ReactBootstrap.Modal;

var Recipe = React.createClass({
  render: function() {
    var ingredients = this.props.recipe.ingredients.map(function(ing, index) {
      return React.createElement('li', {
        className: 'ingredient', key: 'ingredient-' + index 
      }, ing);
    });
    var directions = this.props.recipe.directions.split('\n').map(function(dir, index) {
      return React.createElement("li", {
        className: 'direction-item', key: 'directions-' + index
      }, dir);
    })
    return React.createElement('div', {className: 'recipe-box'},          
        React.createElement('h2', {
          className: 'recipe-title edit-' + this.props.editMode,
          onClick: this.props.showRecipe.bind(null, this.props.index)
        }, this.props.recipe.name, 
          React.createElement('button', {
            className: 'btn btn-sm btn-danger pull-right hidden-' + !this.props.editMode,
            onClick: this.props.deleteRecipe.bind(null, this.props.index)
          }, "Delete"), 
          React.createElement('button', {
            className: 'btn btn-sm btn-info pull-right hidden-' + !this.props.editMode,
            onClick: this.props.editRecipe.bind(null, this.props.index)
          }, "Edit")
        ),  
        React.createElement('div', {className: 'recipe-contents'},                       
          React.createElement('div', {className: 'half ingredients'}, 
            React.createElement('h1', {className: 'ingredient-title'}, "Ingredients"), 
            React.createElement('ul', {
              key: 'ingredient-list', className: 'ingredient-list'
            }, ingredients)),

          React.createElement('div', {className: 'half directions'}, 
            React.createElement('h1', {className: 'directions-title'}, "Directions"), 
            React.createElement('ul', {
              key: 'direction-list', className:'direction-list'
            }, directions)))
     ); // end return
  }
})

var NewRecipeModal = React.createClass({
  saveRecipe: function() {
    var name = React.findDOMNode(this.refs['new-recipe-name']);
    var ingredients = React.findDOMNode(this.refs['new-recipe-ingredients']);
    var directions = React.findDOMNode(this.refs['new-recipe-directions']);
    this.props.saveRecipe(name.value, ingredients.value, directions.value)
  },
  updateRecipe: function() {
    var name = React.findDOMNode(this.refs['new-recipe-name']);
    var ing = React.findDOMNode(this.refs['new-recipe-ingredients']);
    var dir = React.findDOMNode(this.refs['new-recipe-directions']);
    this.props.updateRecipe(name.value, ing.value, dir.value, this.props.editIndex);
  },
  render: function() {
    var name = "";
    var ing = "";
    var dir = "";
    var button;
    if(this.props.editIndex >= 0) {
      var recipe = this.props.recipes[this.props.editIndex];
      name = recipe.name;
      ing = recipe.ingredients.join("\n");
      dir = recipe.directions;
      button = React.createElement( ReactBootstrap.Button, { 
        bsStyle: "primary", onClick: this.updateRecipe
      }, "Update" )
    } else {
      button = React.createElement( ReactBootstrap.Button, { 
        bsStyle: "primary", onClick: this.saveRecipe
      }, "Save" )
    }
    return React.createElement('div', {},
      React.createElement(Modal, {
          show: this.props.modalOpen,
          className: 'static-modal',
          onHide: this.hideModal
        },                      
        React.createElement(Modal.Dialog, {
            onHide: this.hideModal}, 
          React.createElement(Modal.Header, null,
            React.createElement(Modal.Title, null, "Add Recipe")
          ),
          React.createElement(Modal.Body, null, 
            React.createElement('form', {className: 'form-horizontal'}, 
              React.createElement('div', {className: 'form-group row'}, 
                React.createElement('label', null, "Recipe Name"),
                React.createElement('input', {
                    className: 'form-control',
                    id: 'new-recipe-name',
                    ref: 'new-recipe-name',
                    defaultValue: name
                  }),
                React.createElement('div', {className: 'left'}, 
                  React.createElement('label', null, "Add Ingredients, one per line"),
                  React.createElement('textarea', {
                    className: 'form-control',
                    id: 'new-recipe-ingredients',
                    ref: 'new-recipe-ingredients',
                    defaultValue: ing
                  })
                ),
                React.createElement('div', {className: 'right'}, 
                  React.createElement('label', null, "Add Directions"),
                  React.createElement('textarea', {
                    className: 'form-control',
                    id: 'new-recipe-directions',
                    ref: 'new-recipe-directions',
                    defaultValue: dir
                  })
                )
              )
            )
          ),
          React.createElement(Modal.Footer, null,
            React.createElement(
              ReactBootstrap.Button, {onClick: this.props.hideModal}, "Close"
            ), button)
        )
      )
    )
  }
})

var Main = React.createClass({
  getInitialState: function() {
    return {
      recipes: [],
      modalOpen: false,
      editMode: false,
      editIndex: -1
    }
  },
  componentDidMount: function() {
    if(!localStorage.getItem('recipes') || localStorage.getItem('recipes') === 'null') {
      localStorage.setItem('recipes', JSON.stringify(recipeSeed));
    } 
    var recipes = JSON.parse(localStorage.getItem('recipes'))
    this.setState({
      recipes: recipes
    });
    $(document).ready(function() {
      $('.recipe-contents').addClass('minimized ')
    })
  },
  showModal: function() {
    this.setState({modalOpen: true});
  },
  hideModal: function() {
    this.setState({
      modalOpen: false,
      editIndex: -1
    });
  },
  showRecipe: function(index) {
    var element = $('.recipe-contents').eq(index);
    if(element.hasClass('minimized') && !this.state.editMode) {
      element.slideDown()
      element.removeClass('minimized')
    } else {
      element.slideUp()
      element.addClass('minimized')
    }
  },
  saveRecipe: function(name, ing, dir) {
    var newRecipe = {
      name: name,
      ingredients: ing.split('\n'),
      directions: dir
    }
    this.updateStorage(this.state.recipes.concat(newRecipe))
    this.setState({
      modalOpen: false,
      recipes: this.state.recipes.concat(newRecipe)
    }, function() {
      $('.recipe-contents').addClass('minimized ');
    })
  },
  deleteRecipe: function(index) {
    var newRecipes = this.state.recipes.filter(function(recipe, i) {
      return index !== i;
    })
    console.log(newRecipes)
    this.updateStorage(newRecipes)
    this.setState({
      recipes: newRecipes
    })
  },
  toggleEditMode: function() {
    this.setState({
      editMode: !this.state.editMode
    })
  },
  editRecipe: function(index) {
    this.setState({
      modalOpen: true,
      editIndex: index
    });
  },
  updateRecipe: function(name, ing, dir, index) {
    var updated = {
      name: name,
      ingredients: ing.split('\n'),
      directions: dir
    }
    var updatedRecipes = this.state.recipes
    updatedRecipes.splice(index, 1, updated)
    this.updateStorage(updatedRecipes)
    this.setState({
      modalOpen: false,
      recipes: updatedRecipes,
      editIndex: -1
    }, function() {
      $('.recipe-contents').addClass('minimized ');
    })
  },
  updateStorage: function(recipes) {
    localStorage.setItem('recipes', [JSON.stringify(recipes)])
  },
  render: function() {
    var recipesList = []
    for(var i=0;i<this.state.recipes.length; i++) {
      recipesList.push(React.createElement(Recipe, {
        recipe: this.state.recipes[i],
        editMode: this.state.editMode,
        showRecipe: this.showRecipe,
        editRecipe: this.editRecipe,
        deleteRecipe: this.deleteRecipe,
        key: 'recipe-' + i,
        index: i
      }))
    }
    return React.createElement('div', {className: 'container'}, 
      React.createElement('h1', {className: 'title'}, 'Recipe Box'),
      React.createElement('button', {
        className: 'btn btn-primary recipe-btn',
        onClick: this.showModal
      }, "Add Recipe"),
      React.createElement('button', {
        className: 'btn btn-primary recipe-btn',
        onClick: this.toggleEditMode
      }, "Edit Recipes"),
      React.createElement('div', {recipes: this.state.recipes}, recipesList),
      React.createElement(NewRecipeModal, {
        recipes: this.state.recipes,
        modalOpen: this.state.modalOpen,
        showModal: this.showModal,
        hideModal: this.hideModal,
        saveRecipe: this.saveRecipe,
        editIndex: this.state.editIndex,
        updateRecipe: this.updateRecipe
      })
    );
  }
})

React.render(React.createElement(Main), document.getElementById("root"));
