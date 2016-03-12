var React = require('react');
var TableRow = require('./submitDealTableRow');
var request = require('superagent');

module.exports = React.createClass({
  componentWillMount: function(){
    this.getProducts(1);
  },
  getProducts: function(page){
    var that = this;
    request
    .get('/merchantActive/products/')
    .query({'page': page})
    .withCredentials()
    .set('Accept', 'application/json')
    .end(function(err, res){
      if (err){

      }else if (res){
        //console.log('Response: ', res)
        that.setState({products: res.body['page' + page]});
      }
    });
  },
  getInitialState: function(){
    return{
      //products: [{id: 1, title: 'Product One', currentLowPrice: 30, currentHighPrice: 40}, {id: 2, title: 'Product Two', currentLowPrice: 40, currentHighPrice: 50}]
      products: []
    }
  },
  renderTableRows: function(){
    return this.state.products.map(function(productProp){
      return <TableRow product={productProp} key={productProp.id}>
      </TableRow>

    })
  },
  render: function(){
    return <span className="col-lg-10">
      <div className="panel panel-default">
        <div className="panel-heading"><h3>Submit Deals</h3></div>
        <div className="panel-body">
          <p>Instructions and stuff for submitting.</p>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th className="text-center">Product</th>
              <th className="text-center">Current Price Range</th>
              <th className="text-center">% to Discount All Variants</th>
              <th className="text-center">Discounted Price Range</th>
              <th className="text-center">Deal Duration</th>
              <th className="text-center">Revert Prices When Deal is Done?</th>
              <th className="text-center"></th>
            </tr>
          </thead>
          <tbody>
            {this.renderTableRows()}
          </tbody>
        </table>
      </div>
    </span>
  }
});
