<div align="center">
<h1>option-pricing-tree</h1>
<a href="https://npmjs.com/package/option-pricing-tree">
<img src="https://img.shields.io/npm/v/option-pricing-tree.svg" alt="npm version" />
</a>
<a href="https://npmjs.com/package/option-pricing-tree">
<img src="https://img.shields.io/npm/dt/option-pricing-tree.svg" alt="npm downloads" />
</a>
<br/>
<br/>
<p>
option-pricing-tree is a JavaScript module for pricing options using bi/tri-nomial tree under black scholes assumption.
</p>
</div>

## Option Pricing
This module implement the bi/tri nomial tree pricing, under log normal black scholes model/assumption. 

## Installation
This module works on node and in the browser. It is available as the 'option-pricing-tree' package on [npm](https://www.npmjs.com/package/option-pricing-tree).

### npm

```
npm install option-pricing-tree
```

## Usage

```javascript
var Tree = require('option-pricing-tree');
var tree = new Tree('trinomial','european','call',1,100,100,0.1,0);
var value = tree.build(1000);
```

Data can be passed into the model as an points array, or as xArray, yArray. The last (2nd or 3rd, depends on what's the input format) parameter can be used to configure the model. 
For details, please consult regression package documentation.


## API

### `new Tree(tree_type, exercise_style, option_type, expiry_in_years, strike, underlying, vol, rate)`
- `tree_type`: Either binomial, or trinomial
- `exercise_style`: Either european or american
- `option_type`: Either call, put, or straddle
- `expiry_in_years`: Eg. 1 for 1y, or 0.5 for 6 months
- `strike`: Strike of the option 
- `underlying`: Underlying price 
- `vol`: (Implied) Annualized log-normal volatility
- `rate`: Risk-free rate
