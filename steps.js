// data module
var budgetController = (function() {
  //1. define Expense, Income

  //2. create data stucture

  return {
    //3. function addItem to datastructure
    //4. function calculateBudget
    //5. function getBudget
  };
})();

//UI module
var UIController = function() {
  return {
    //1. function getInput from user
    //2. function addListItem to the UI
    //3. function displayBudget
  };
};

//Controller module
var controller = (function(budgetCtrl, UICtrl) {
  //1. func setupEventListeners

  // 2. func ctrlAddItem
  //     2.1 read input and store in a variable
  //     2.2 add item into budget controller
  //     2.3 add item to UI
  //     2.4 clear the input field
  //     2.5 calculate and update budget

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
