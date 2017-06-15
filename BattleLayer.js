require("battle/BattleManager.js")

//scene上只有一个BattleLayer
BattleScene  = vega.frameworks.SceneBase.extend(
{
	_claseName : "BattleScene",

	ctor : function() 
	{	this._super();

		this.addBattleLayer();
	},

	addBattleLayer : function()
	{

	}
});

/* 战斗UI相关都添加在BattleLayer
 * BG 战斗背景
 * menu 战斗操作界面，包括双方hero，自动战斗button，战斗速度button， 部署button，我方备战区卡牌
 * FightingLayer 该layer包括出战卡牌，以及互相战斗
 * FullScreenEffect 全屏特效，需要的时候添加
*/
BattleLayer = vega.frameworks.LayerBase.extend(
{
	_claseName : "BattleLayer",

	ctor : function()
	{
		this._super();

		BattleManager.setBattleLayer(this);

		this.addBG();
		this.addMenu();
		this.addFightingLayer();
	},

	addBG : function()
	{

	},

	addMenu : function()
	{

	},

	addFightingLayer : function()
	{

	},

	fighting : function()
	{
		BattleManager.allCardFighting();
	}
});