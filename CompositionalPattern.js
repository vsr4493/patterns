/** 
 * Ok, what's this all about?
 * Composing objects for closures vs classes (In particular createDog vs DogWithComposition)
 */

const Barkable = (state) => {
	return {
		bark: () => state.name,
	}
};

// I am the alpha and the omega!
const createDog = (name = 'blah blah') => {
	const state = {
		name,
	};
	const barker = Barkable(state);
	return {
		bark: barker.bark,
	};
}

class Barker {
	constructor(name) {
		this.name = name;
	}
	bark() {
		return this.name;
	}
}

class DogWithComposition {
	constructor(name = 'blah blah') {
		this.name = name;
		this.barker = new Barker(name); // has-a Barker
	}
	bark() {
		return this.barker.bark();
	}
}

// Mixing closures and class?

class DogWithIdentityIssues {
	constructor(name = 'blah blah') {
		this.name = name;
		this.barker = Barkable(name); // has-a Barker
	}
	bark() {
		return this.barker.bark();
	}
}

// As simple as it gets
class DogWithProto {
	constructor(name = 'blah blah') {
		this.name = name;
	}
	bark() {
		return this.name;
	}
}

// um..ok
class DogWithProtoWithBind {
	constructor(name = 'blah blah') {
		this.name = name;
		this.bark = this.bark.bind(this);
	}
	bark() {
		return this.name;
	}
}

console.clear();
const Benchmark = require('benchmark');

const suite = new Benchmark.Suite;
// add tests
suite.add('Closure', function() {
  for(let i = 0; i<1000; i++) {
  	const dog = createDog(i);
  	const whatDidTheDogSay = dog.bark();
  }
}).add('Class with composition', function() {
  for(let i = 0; i<1000; i++) {
  	const dog = new DogWithComposition(i);
  	const whatDidTheDogSay = dog.bark();
  }
}).add('Class + Closure', function() {
  for(let i = 0; i<1000; i++) {
  	const dog = new DogWithIdentityIssues(i);
  	const whatDidTheDogSay = dog.bark();
  }
}).add('Good old classes, who needs composition', function() {
  for(let i = 0; i<1000; i++) {
  	const dog = new DogWithProto(i);
  	const whatDidTheDogSay = dog.bark();
  }
})
.add('Good old classes, but we gotta use bind', function() {
  for(let i = 0; i<1000; i++) {
  	const dog = new DogWithProtoWithBind(i);
  	const whatDidTheDogSay = dog.bark();
  }
})
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
})
// run async
.run({ 'async': false });

/** Results: 
	Closure x 14,371 ops/sec ±1.68% (89 runs sampled)
	Class with composition x 57,946 ops/sec ±1.94% (85 runs sampled)
	Class + Closure x 15,201 ops/sec ±1.25% (90 runs sampled)
	Good old classes, who needs composition x 135,803 ops/sec ±1.90% (88 runs sampled)
	Good old classes, but we gotta use bind x 61,795 ops/sec ±1.78% (89 runs sampled)
	Fastest is Good old classes, who needs composition
*/

