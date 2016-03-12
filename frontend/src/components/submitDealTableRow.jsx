var React = require('react');

module.exports = React.createClass({
  getInitialState: function(){
    return{
      low: '',
      high: '',
      percentValid: false,
      isEmpty: true
    }
  },
  calculateDiscount: function(event){
    if (event.target.value.length > 0){
      var value = Number(event.target.value)
      if (isNaN(value)){
        this.setState({low: '', high: '', percentValid: false, isEmpty: false});
      }else{
        if (value >= 1 && value < 100){
          var lowPrice = this.props.product.priceLow - this.props.product.priceLow * (value * 0.01)
          lowPrice = lowPrice.toFixed(2);
          var highPrice = this.props.product.priceHigh - this.props.product.priceHigh * (value * 0.01)
          highPrice = highPrice.toFixed(2);
          this.setState({low: lowPrice, high: highPrice, percentValid: true, isEmpty: false});
        }else{
          this.setState({low: '', high: '', percentValid: false, isEmpty: false});
        }
      }
    }else{
      this.setState({low: '', high: '', percentValid: false, isEmpty: true});
    }
  },
  render: function(){
    return <tr>
      <td>{this.props.product.title}</td>
      <td>$ {this.props.product.priceLow} - {this.props.product.priceHigh}</td>
      <td>
        <input type="text" className="percentInput" ref="percentDiscount" onChange={this.calculateDiscount}></input> %
        <p className="warning">{!this.state.percentValid && !this.state.isEmpty ? "Must be a number between 1 and 99" : null}</p>
      </td>
      <td>$ {this.state.low} - {this.state.high}</td>
      <td>
        <select name="duration" ref="duration" defaultValue="7">
          <option value="3">3 Days</option>
          <option value="5">5 Days</option>
          <option value="7">7 Days</option>
        </select>
      </td>
      <td><input type="checkbox" ref="revertPrices" value="check"></input></td>
      <td><button className="btn">Submit</button></td>
    </tr>
  }
});
