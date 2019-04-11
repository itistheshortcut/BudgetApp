var budgetController = (function() {
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotal = function(type) {
    var sum = 0;
    data.allItems[type].forEach(function(element) {
      sum += element.value;
    });
    data.totals[type] = sum;
  };

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0
  };

  return {
    addItem: function(type, des, val) {
      var newItem, ID;

      //create new ID= index
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      //create new item based on inc or exp type
      if (type === "exp") {
        newItem = new Expense(ID, des, val);
      } else if (type === "inc") {
        newItem = new Income(ID, des, val);
      }

      //push it into data structure
      data.allItems[type].push(newItem);
      return newItem;
    },

    deleteItem: function(type, ID) {
      var ids, index;

      ids = data.allItems[type].map(function(element) {
        return element.id;
      });

      index = ids.indexOf(ID);
      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },

    calculateBudget: function() {
      calculateTotal("exp");
      calculateTotal("inc");

      data.budget = data.totals.inc - data.totals.exp;
    },

    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    }
  };
})();

var UIController = (function() {
  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn",
    incomeContainer: ".income__list",
    expenseContainer: ".expenses__list",
    expensesPerclabel: ".item__percentage",
    dateLabel: ".budget__title--month",
    container: ".container"
  };

  //type is "inc" or "exp"
  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },

    addListItem: function(obj, type) {
      var html, newHtml, element;

      if (type === "inc") {
        element = DOMstrings.incomeContainer;

        html =
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === "exp") {
        element = DOMstrings.expenseContainer;

        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      console.log(html);

      //replace the placeholder text with real data
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", obj.value);
      console.log(newHtml);
      //insert real html into the DOM
      //beforeend is location
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },

    deleteListItem: function(selectorID) {
      var el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
    },

    clearFields: function() {
      var fields, fieldsArr;

      fields = document.querySelectorAll(
        DOMstrings.inputDescription + "," + DOMstrings.inputValue
      );

      //convert list to array
      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach(function(element) {
        element.value = "";
      });

      fieldsArr[0].focus();
    },

    displayBudget: function(obj) {
      //.textcontent ok
      document.querySelector(".budget__value").innerHTML = obj.budget;
      document.querySelector(".budget__income--value").innerHTML = obj.totalInc;
      document.querySelector(".budget__expenses--value").innerHTML =
        obj.totalExp;
    },

    getDOMstrings: function() {
      return DOMstrings;
    }
  };
})();

var controller = (function(budgetCtrl, UICtrl) {
  var setupEventListeners = function() {
    var DOM = UICtrl.getDOMstrings();

    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

    //instead of adding eventlistener to all income and expense, add it to the container, which is the common one
    document
      .querySelector(DOM.container)
      .addEventListener("click", ctrlDeleteItem);
  };

  var updateBudget = function() {
    //1. calculate the budget
    budgetCtrl.calculateBudget();

    //2. return the budget
    var budget = budgetCtrl.getBudget();

    //3. display the budget on the UI => method on UI controller
    UICtrl.displayBudget(budget);
  };

  var ctrlAddItem = function() {
    var DOM = UICtrl.getDOMstrings();

    //1. get the field input data
    //read input and store in a variable
    var input = UICtrl.getInput();

    if (input.description !== "" && input.value > 0 && !isNaN(input.value)) {
      //2. add item into budget controller
      var newItem = budgetCtrl.addItem(
        input.type,
        input.description,
        input.value
      );

      //3.add item to UI
      UICtrl.addListItem(newItem, input.type);

      //4. clear the fields
      UICtrl.clearFields();
    }
    //5. calculate and update budget
    updateBudget();
  };

  var ctrlDeleteItem = function(event) {
    var splitID, type, ID;

    var itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    console.log(itemID);

    if (itemID) {
      //inc-1
      splitID = itemID.split("-");
      type = splitID[0];
      //ID is string bcuz split from string => parseInt convert to int
      ID = parseInt(splitID[1]);
    }

    //2. delete item from data structure
    budgetCtrl.deleteItem(type, ID);

    //3.delete item from UI
    UICtrl.deleteListItem(itemID);

    //4.update budget
    updateBudget();
  };

  return {
    init: function() {
      console.log("app started");
      setupEventListeners();

      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0
      });
    }
  };
})(budgetController, UIController);

controller.init();
