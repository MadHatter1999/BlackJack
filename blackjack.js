/**
 * Created by Anthony Healy
 */
LockControls();
var has_Started=false;
var Deck;
//Webpage Items 
var Banner;
var Dealer_UI;
var Player_UI;


var Player={
    Score:0,
    Cards:undefined,
    Hand:[]
};

var Dealer={
    Score:0,
    Cards:undefined,
    Hand:[]

};

var cards={ACE:'ACE',KING:'KING',QUEEN:'QUEEN',JACK:'JACK',TEN:'10',NINE:'9',EIGHT:'8',SEVEN:'7',SIX:'6',FIVE:'5',FOUR:'4',THREE:'3',TWO:'2',ONE:'1'};

//This Starts the game
function StartGame(){
    if(!has_Started){
        LockStart();
        UnLockControls();
        has_Started=true;
        var ID;

        Banner=document.getElementById('banner');
        Player.Cards=document.getElementById('player_cards');
        Player_UI=document.getElementById('player_score');
        Dealer.Cards=document.getElementById('dealer_cards');
        Dealer_UI=document.getElementById('dealer_score');


        var xhttp= new XMLHttpRequest();
        const URL='https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1';
        xhttp.onreadystatechange= async function(){
            if(xhttp.readyState===XMLHttpRequest.DONE){
                if(xhttp.status===200){
                    //Process the Responce
                     var Data= JSON.parse(xhttp.responseText);
                     Deck= Data.deck_id;
                     BeginHits(Player,Data.deck_id);
                     BeginHits(Dealer,Data.deck_id);
                     Has_Won();
                }
                else{
                    alert("Somthing went wrong");
                }
            }
        };
        xhttp.open("Get",URL);
        xhttp.send();
    }
    else{
        EndGame();
    }
    
}


/**
 * This hits for you
 * @param {*} player 
 */
function Hit(){
    if(has_Started){
        var card;
            var xhttp= new XMLHttpRequest();
            const URL='https://deckofcardsapi.com/api/deck/'+Deck+'/draw/?count=1';
            xhttp.onreadystatechange= async function(){
                if(xhttp.readyState===XMLHttpRequest.DONE){
                    if(xhttp.status===200){
                        //Process the Responce
                        card= await JSON.parse(xhttp.responseText);
                        Player.Cards.innerHTML+="<img src='"+card.cards[0].image+"'>";
                        Player.Hand.push(card.cards[0].value);
                        Calculate_Scores(Player);
                        Has_Won(false);
                        
                    }
                    else{
                        alert("Somthing went wrong");
                    }
                }
            };
            xhttp.open("Get",URL);
            xhttp.send();

    }
}

function BeginHits(user,Deck_ID){
    if(has_Started){
        var card;
            var xhttp= new XMLHttpRequest();
            const URL='https://deckofcardsapi.com/api/deck/'+Deck_ID+'/draw/?count=2';
            xhttp.onreadystatechange= async function(){
                if(xhttp.readyState===XMLHttpRequest.DONE){
                    if(xhttp.status===200){
                        //Process the Responce
                        card= await JSON.parse(xhttp.responseText);
                        user.Hand.push(card.cards[0].value);
                        user.Hand.push(card.cards[1].value);
                        user.Cards.innerHTML+="<img src='"+card.cards[0].image+"'>";
                        user.Cards.innerHTML+="<img src='"+card.cards[1].image+"'>";
                        Calculate_Scores(user);
                        Has_Won(false);

                    }
                    else{
                        alert("Somthing went wrong");
                    }
                }
            };
            xhttp.open("Get",URL);
            xhttp.send();

    }

}

//Stay with your and
function Stay(){
    if(has_Started){
        var card;
            var xhttp= new XMLHttpRequest();
            const URL='https://deckofcardsapi.com/api/deck/'+Deck+'/draw/?count=1';
            xhttp.onreadystatechange= async function(){
                if(xhttp.readyState===XMLHttpRequest.DONE){
                    if(xhttp.status===200){
                        //Process the Responce
                        card= await JSON.parse(xhttp.responseText);
                        Dealer.Hand.push(card.cards[0].value);
                        Dealer.Cards.innerHTML+="<img src='"+card.cards[0].image+"'>";
                        Calculate_Scores(Dealer);
                        Has_Won(true);
                        LockControls();
                    }
                    else{
                        alert("Somthing went wrong");
                    }
                }
            };
            xhttp.open("Get",URL);
            xhttp.send();

    }

}
/*
Logic
*/

// Ends the match and 
function EndMatch(Message){
    Banner.innerHTML=Message;
    has_Started=false;
    LockControls();
    UnlockStart();
    document.getElementById('btnStart').value="Reset";
}

//Checks if WON
function Has_Won(From_Stay){

    if(From_Stay){
        if((Player.Score> Dealer.Score && Player.Score<=21) || Dealer.Score > 21){
            EndMatch("Player Won");
        }
        else if((Dealer.Score> Player.Score && Dealer.Score<=21) || Player.Score > 21){
            EndMatch("Dealer Won");
        }
        else{
            EndMatch("Draw");
        }
    }
    else{
        if(Player.Score===21 && Dealer.Score===21){
            EndMatch("Draw");
    
        }
        else if(Player.Score===21 || Dealer.Score>21){
            EndMatch("Player Won");
    
        }
        else if(Dealer.Score===21 || Player.Score>21){
            EndMatch("Dealer Won");
        }
    }
     
}
//Calculate scores
function Calculate_Scores(user){   
        var count=0;
        user.Score=0;
        for(var card in user.Hand){
            switch(user.Hand[count]){
                case cards.ACE:
                    user.Score+=11;
                    break;
                case cards.KING:
                    user.Score+=10;
                    break;
                case cards.QUEEN:
                    user.Score+=10;
                    break;
                case cards.JACK:
                    user.Score+=10;
                    break;
                case cards.TEN:
                case cards.NINE:  
                case cards.EIGHT: 
                case cards.SEVEN:   
                case cards.SIX:  
                case cards.FIVE:     
                case cards.FOUR:              
                case cards.THREE:               
                case cards.TWO:               
                case cards.ONE:
                    user.Score+=parseInt(user.Hand[count]);
                    break;
            }
            count++;
        }
    
    
    UpdateScores();
    EndGame();
    
}
///Clears game
function EndGame(){
    if(!has_Started){
        LockControls();
        has_Started=false;

        Player.Hand=[];
        Dealer.Hand=[];

        Player.Score=0;
        Dealer.Score=0;

        document.getElementById('btnStart').value="Start Game";

        Dealer_UI.innerHTML="Dealer:"+Dealer.Score;
        Player_UI.innerHTML="Player:"+Player.Score;

        Banner.innerHTML="Let's Play Blackjack";

        Player.Cards.innerHTML=" ";
        Dealer.Cards.innerHTML=" ";
    }
}
/*
UI
*/
///Update the scores
function UpdateScores(){
    Dealer_UI.innerHTML="Dealer:"+Dealer.Score;
    Player_UI.innerHTML="Player:"+Player.Score;
}

/**
 * Controls
 */
//Locks Hit and Stay
function LockControls(){
    LockStay();
    LockHit();
}
 //Unlocks Hit and Stay
function UnLockControls(){
    UnlockStay();
    UnlockHit();
    
}
function LockHit(){
    document.getElementById('hit').disabled=true;
}

function UnlockHit(){
    document.getElementById('hit').disabled=false;
}

function LockStay(){
    document.getElementById('stay').disabled=true;
}

function UnlockStay(){
    document.getElementById('stay').disabled=false;
}

//Start Game control
function UnlockStart(){
    document.getElementById('btnStart').disabled=false;
}

function LockStart(){
    document.getElementById('btnStart').disabled=true;
}