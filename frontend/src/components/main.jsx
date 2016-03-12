var React = require('react');
var classNames = require('classnames');
var CreateDeal = require('./submitDeals');
var Modal = require('react-bootstrap').Modal;
var CardForm = require('./cardForm');

module.exports = React.createClass({
  getInitialState: function(){
    return{
      isSelected: [true, false, false],
      isHovered: [false, false, false],
      showCardForm: true
    }
  },
  setSelected: function(item){
    console.log('set selected called');
    if (item == 0){
      this.setState({isSelected: [true, false, false]});
    }else if (item == 1){
      this.setState({isSelected: [false, true, false]});
    }else if (item == 2){
      this.setState({isSelected: [false, false, true]});
    }
  },
  setHover: function(item){
    console.log('set hover called');
    if (item == 0){
      this.setState({isHovered: [true, false, false]});
    }else if (item == 1){
      this.setState({isHovered: [false, true, false]});
    }else if (item == 2){
      this.setState({isHovered: [false, false, true]});
    }
  },
  menuItemClass: function(item){
    return classNames({
      'active' : this.state.isSelected[item]
    });
  },
  closeCardForm: function(){
    this.setState({showCardForm: false})
  },
  openCardForm: function(){
    this.setState({showCardForm: true})
  },
  render: function(){
    return <div>
      <span className="col-lg-2">
        <ul className="nav nav-pills nav-stacked navMain">
          <li className={this.menuItemClass(0)} onClick={this.setSelected.bind(this, 0)} ><a>Submit Deals</a></li>
          <li className={this.menuItemClass(1)} onClick={this.setSelected.bind(this, 1)} ><a>Stats</a></li>
          <li className={this.menuItemClass(2)} onClick={this.setSelected.bind(this, 2)} ><a>Payment Info</a></li>
        </ul>
      </span>
      <CreateDeal closeCardForm={this.closeCardForm} openCardForm={this.openCardForm}></CreateDeal>
      <Modal show={this.state.showCardForm} onHide={this.closeCardForm} bsSize="small">
        <CardForm closeCardForm={this.closeCardForm}></CardForm>
      </Modal>
    </div>
  }
});
