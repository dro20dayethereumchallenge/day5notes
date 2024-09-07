import React, {Component} from 'react'
import Web3 from 'web3'
import VotingAbi from './contractsData/Voting.json'
import VotingAddress from './contractsData/Voting-address.json'

class App extends Component {
    componentWillMount(){
        this.loadBlockchainData()
    }

    async loadBlockchainData(){
        console.log('VotingAddress.address', VotingAddress.address)
        console.log('VotingAbi.abi', VotingAbi.abi)
        const web3 = new Web3(new Web3.providers.HttpProvider("http://ec2-54-188-123-47.us-west-2.compute.amazonaws.com:8545"))
        var account;
        const accounts  = await web3.eth.getAccounts()
        console.log(accounts)
        this.setState( { account : accounts[0] })
        this.setState( { account2 : accounts[1] })
        console.log(account);
        const contract = new web3.eth.Contract(VotingAbi.abi);
        contract.options.address = VotingAddress.address
        this.setState( { contract })
        let myCandidateList = await  contract.methods.getCandidateList().call();
        console.log(myCandidateList);
        var count = await this.state.contract.methods.totalVotesFor('Johnny').call(console.log);
        this.setState( { Johnny: parseInt(count) } )
        count = await this.state.contract.methods.totalVotesFor('Amber').call(console.log);
        this.setState( { Amber : parseInt(count) } )
    }
    constructor(props){
        super(props)
        console.log("constructor")
        this.state = {
            account: '',
            loading: true,
            message: ''
        }
     this.voting = this.voting.bind(this)
     this.votingtwo = this.votingtwo.bind(this)
    }
    voting = async (name) =>  {
        this.state.contract.methods.voteForCandidate(name).send({gas: 140000, from: this.state.account });
        var count = await this.state.contract.methods.totalVotesFor(name).call(console.log);
        count = this.state[name]
        count++
        console.log("my count")
       console.log(count)
        this.setState( { [name]: count } )


    }
    votingtwo = async (name) =>  {
        this.state.contract.methods.voteForCandidate(name).send({gas: 140000, from: this.state.account2 });
        var count = await this.state.contract.methods.totalVotesFor(name).call(console.log);
        count = this.state[name]
        this.setState( { [name]: parseInt(count) } )
 }


render(){

        return (
                <div>
                <div>
                 <button onClick={() => this.voting("Johnny")}>Johnny vote</button>
                 <button onClick={() => this.voting("Amber")}>Amber vote</button>

                </div>
                 <button onClick={() => this.votingtwo("Johnny")}>Johnny vote</button>
                 <button onClick={() => this.votingtwo("Amber")}>Amber vote</button>

                <h5>Johnny count: {this.state.Johnny}</h5>
                <h5>Amber count: {this.state.Amber}</h5>

                </div>
        );
}
}

export default App;
