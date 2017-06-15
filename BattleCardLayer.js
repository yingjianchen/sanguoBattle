BattleCardLayer = vega.frameworks.LayerBase.extend(
{
	_claseName : "BattleCardLayer",
	_spine : null,
	//出手开始之后施法次数
	_castTimes : 0,
	ctor : function()
	{
		this._super();
		this.addSpine();
	},

	addSpine : function()
	{
		this._spine = vega.VegaSpineAnimation.createWithJsonFile('res/menghuo/menghuo.json', "res/menghuo/menghuo.atlas", true, 0.7);
        this._spine.setPosition(cc.p(0,0));
        this._spine.setAnimation(0, "daiji", true);
        this.addChild(this._spine);
	},

	//当前出战卡牌被杀死后调用
	isKilled : function()
	{
		this.removeFromParent();
	},

	//轮到当前卡牌出手,有可能连续释放多个技能
	beginFighting : function()
	{
		data.owner_id = 123;
		data.skill_id = 456;
		data.owner_index = 1;
		data.owner_type = 1;
		data.card = this;
		var flag = BattleSkillManager.needCast(data);
		if (2 == flag)
		{
			this.moveToTarget(flag)
		}
		else
		{
			if (BattleSkillManager.isMagicAttack(data.skill_id))
			{
				this.moveToTargetOver();
			}
			else if (BattleSkillManager.isMagicAttack(data.skill_id))
			{
				this.moveToTarget();
			}
		}
	},

	//卡牌出手结束
	endFighting : function()
	{

	},

	//普攻和物理技能，需要移动到目标跟前
	//flag == 2 普攻
	moveToTarget : function(flag)
	{
		this.moveToTargetOver(flag)
	},

	moveToTargetOver : function(flag)
	{
		
	},

	//开始施法
	cast : function(data)
	{
		this._castTimes +=1;
		this._spine.setAnimation(0, "pugong", true);
		this._spine.setAnimation(0, "jineng", true);
		var animationCallBack = function()
		{
			BattleSkillManager.cast(data);
			BattleManager.castOver();
		}
	},
});