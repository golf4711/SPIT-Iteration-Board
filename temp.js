Ext.define('CustomApp',
{
    extend: 'Rally.app.App',
    componentCls: 'app',

	// -------------------
    // Entry Point to App
	// -------------------
    launch: function() {
		this._loadData();
    },
	
    _loadData: function()
	{
		this.taskStore = Ext.create('Rally.data.wsapi.Store',
		{
			model: 'Task',
			autoLoad: true,
			fetch: ["WorkProduct", "Name", "State", "Estimate", "ToDo", "Actuals"]
		});
    },

    _createGrid: function(myTaskStore)
	{
      this.myGrid = Ext.create('Rally.ui.grid.Grid',
	  {
        store: myTaskStore,
		title: "Your Tasks by Sprint",
        columnCfgs: ["WorkProduct", "Name", "State", "Estimate", "ToDo", "Actuals"]
      });
      this.add(this.myGrid);
    }

});
