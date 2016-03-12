var React = require('react');
var request = require('superagent');

module.exports = React.createClass({
  getInitialState: function(){
    return{
      buttonActive: true,
      showErrors: false,
      errors: '',
      isActivating: false,
      status: 'Activate'
    }
  },
  submitForm: function(e){
    console.log('submit Form called');
    e.preventDefault();
    this.setState({buttonActive: false, isActivating: true, showErrors: false, errors: '', status: 'Verifying Card'})
    Stripe.card.createToken({
      number: this.refs.cardNumber.value,
      cvc: this.refs.code.value,
      exp_month: this.refs.month.value,
      exp_year: this.refs.year.value
    }, this.handleStripeResponse);
  },
  handleStripeResponse: function(status, response){
    if (response.error){
      this.setState({showErrors: true, errors: response.error.message, buttonActive: true, isActivating: false, status: 'Activate'})
    }else{
      console.log(response);
      this.setState({status: 'Activating'})
      var that = this;
      request.post('/merchantActive/activate')
      .query(response)
      .withCredentials()
      .set('Accept', 'application/json')
      .end(function(err, res){
        if (err){
          //console.log('Err', err);
          //console.log('Res: ', res);
          that.setState({showErrors: true, errors: res.text || err.message, buttonActive: true, isActivating: false, status: 'Activate'})
        }else{
          that.setState({isActivating: false, status: 'Success!'});
          setTimeout(function(){
            that.props.closeCardForm()
          }, 3000);
        }
      });
    }
  },
  renderError: function(){
    return <div className="panel panel-danger errorPanel">
      <div className="panel-heading">Error</div>
      <div className="panel-body">{this.state.errors}</div>
    </div>
  },
  renderSpinner: function(){
    return <i className="fa fa-spinner fa-spin">
    </i>
  },
  render: function(){
    return <div className="row">
      <div className="panel-default credit-card-box panel">
          <div className="panel-heading display-table" >
              <div className="row display-tr" >
                  <h3 className="panel-title display-td" >Payment Details</h3>
                  <div className="display-td" >
                      <img className="img-responsive pull-right" src="/cardsAccepted.png" />
                  </div>
              </div>
          </div>
          <div className="panel-body">
              <form role="form" id="payment-form" onSubmit={this.submitForm}>
                  <div className="row">
                      <div className="col-xs-12">
                          <div className="form-group">
                              <label htmlFor="cardNumber">CARD NUMBER</label>
                              <div className="input-group">
                                  <input type="tel" className="form-control" name="cardNumber" placeholder="Card Number" autoComplete="cc-number" ref="cardNumber" required autofocus />
                                  <span className="input-group-addon"><i className="glyphicon glyphicon-credit-card"></i></span>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div className="row">

                      <div className="col-xs-4 col-md-4">
                          <div className="form-group">
                              <label htmlFor="expireMonth">EXP MO</label>
                              <input type="tel" className="form-control" name="expireMonth" placeholder="MM" autoComplete="cc-exp" ref="month" required />
                          </div>
                      </div>

                      <div className="col-xs-4 col-md-4">
                          <div className="form-group">
                              <label htmlFor="expireYear">EXP YR</label>
                              <input type="tel" className="form-control" name="expireYear" placeholder="YYYY" autoComplete="cc-exp" ref="year" required />
                          </div>
                      </div>

                      <div className="col-xs-4 col-md-4">
                          <div className="form-group">
                              <label htmlFor="cardCVC">CV CODE</label>
                              <input type="tel" className="form-control" name="cardCVC" placeholder="CVC" autoComplete="cc-csc" ref="code" required />
                          </div>
                      </div>

                  </div>
                  <div className="row">
                      <div className="col-xs-12">
                          <button className="btn btn-success btn-lg btn-block" type="submit" disabled={!this.state.buttonActive}>{this.state.isActivating ? this.renderSpinner() : null}{this.state.status}</button>
                      </div>
                  </div>
                  {this.state.showErrors ? this.renderError() : null}
              </form>
          </div>
      </div>
    </div>
  }
});
