<template>
  <div class="ui container">
    <div class="ui basic segment fluid">
      <h1 class="ui header">
        <i class="fa fa-question"></i>
        FAQ
      </h1>
    </div>

    <div class="ui segment raised">
      <div class="ui link list">
        <div class="item">
          WeiCards
          <div class="list">
            <router-link class="item" :to="{ name: 'FAQ', hash: '#how-it-works' }">How it works ?</router-link>
            <router-link class="item" :to="{ name: 'FAQ', hash: '#whats-cool' }">So, what's the deal ?</router-link>
            <router-link class="item" :to="{ name: 'FAQ', hash: '#what-do-i-need' }">What do I need ?</router-link>
          </div>
        </div>
        <div class="item">
          Cards
          <div class="list">
            <router-link class="item" :to="{ name: 'FAQ', hash: '#buy-card' }" >How do I buy a card ?</router-link>
            <router-link class="item" :to="{ name: 'FAQ', hash: '#sell-card' }" >How do I sell a card ?</router-link>
            <router-link class="item" :to="{ name: 'FAQ', hash: '#lease-card' }" >
              How do I lease a card ?
              <div class="list">
                <router-link class="item" :to="{ name: 'FAQ', hash: '#lease-card-tenant' }" >As a tenant</router-link>
                <router-link class="item" :to="{ name: 'FAQ', hash: '#lease-card-lessor' }" >As a lessor</router-link>
              </div>
            </router-link>
            <router-link class="item" :to="{ name: 'FAQ', hash: '#edit-card' }" >How can I edit a card ? </router-link>
            <router-link class="item" :to="{ name: 'FAQ', hash: '#transfer-card-owner' }" >Can I transfer my card to another address ? </router-link>
          </div>
        </div>
        <div class="item">
          Miscellaneous
          <div class="list">
            <router-link class="item" :to="{ name: 'FAQ', hash: '#fees' }">Is there any fees ?</router-link>
            <router-link class="item" :to="{ name: 'FAQ', hash: '#what-is-giveth' }">What is Giveth.io ?</router-link>
            <router-link class="item" :to="{ name: 'FAQ', hash: '#who-are-you' }">Who are you ?</router-link>
            <router-link class="item" :to="{ name: 'FAQ', hash: '#projects-money' }">What will you do with the money ? </router-link>
          </div>
        </div>
      </div>
    </div>
    <div class="ui segment raised">
      <h2 class="ui header" id="how-it-works">
        How it works ?
      </h2>
      <p>WeiCards let you <router-link :to="{ name: 'FAQ', hash: '#buy-card' }" >buy</router-link>, <router-link :to="{ name: 'FAQ', hash: '#lease-card' }" >lease</router-link> and <router-link :to="{ name: 'FAQ', hash: '#sell-card' }" >sell</router-link> cards.
      WeiCards homepage is filled with cards ranked from 1 to 127, no more, no less. Each card is initially
      sold at a price related to its rank, the card #1 is initially sold at 1.27 Ether and card #127 is set at 0.01 Ether.
      A card is made from a descriptive title, a redirection URL and an image set by the card owner.
      For each card sold during the initial sale, <b>10% of the amount is reversed to Giveth.io</b> !
      </p>
      <p>If no cards are available to buy, you probably can rent out one. You'll pay to the card owner a fixed amount of Ether to display
      your details for a pre-determined duration.</p>
      <div class="ui stackable grid">
        <div class="column ten wide">
          <p>Once you purchase a card, it belongs to you. From here you have multiple options :</p>
          <ul>
            <li><b><router-link :to="{ name: 'FAQ', hash: '#lease-card' }" >Rent</router-link></b> it out to someone for a fixed price and duration</li>
            <li><b><router-link :to="{ name: 'FAQ', hash: '#sell-card' }" >Sell</router-link></b> it to a fixed price</li>
            <li><b><router-link class="item" :to="{ name: 'FAQ', hash: '#edit-card' }" >Edit</router-link></b> your card details</li>
            <li><b>Leave</b> it as it is</li>
          </ul>
          <p>
            You can <b>rent out</b> your card to someone willing to rent it. As owner, you will get the total rent amount beforehand.
            During the lease, the card will display and redirect to the details provided by the tenant. Once the lease end,
            the card display your card details again. 
          </p>
          <p>
            <b>Selling</b> a card is as simple as setting a sell price and voilà, your card can now be bought by anyone.
          </p>
          <p>
            You can <b>edit</b> your cards at any time in the card settings 
            (click on card position <span class="ui circular label card-id-label" :data-tooltip="`View card #15 details`" data-inverted=""><b>15</b></span>
            to display its details and settings). From there, you may also <b>transfer the ownership</b> of your card.
          </p>
          <p>
            Finally, you can just <b>leave</b> your card(s) with your details and strut around that you own one (or more !) of 127 unique cards.
          </p>
        </div>
        <div class="column six wide center">
          <!-- Card buy demo -->
          <div class="ui link cards">
            <div class="ui centered card raised">
              <div class="ui fluid image">
                <div class="ui floating right circular label card-id-label" :data-tooltip="`View card #5 details`" data-inverted="">
                    <b>15</b>
                </div>
                <img class="card-image" src="https://images.fastcompany.net/image/upload/w_1280,f_auto,q_auto,fl_lossy/fc/3000999-poster-1920-what-dead-squirrel-taught-me-about-value-pricing.jpg">
              </div>
              <div class="content">
                <div class="ui header">
                  Giraffe
                </div>
                <div class="meta">
                  giraffe.zoo
                </div>
              </div>
              <div class="extra content">
                <div class="ui grid equal width center aligned">
                  <div class="column" :data-tooltip="`Owned by 0x627306090abaB3A6e1400e9345bC60c78a8BEf57`" data-inverted="">
                    <i class="fa fa-user"></i>
                    0x627306090ab...
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card-description">Card #15 is owned by 0x627306090ab...</div>
        </div>
      </div>

      <h2 class="ui header" id="whats-cool">
        So, what's the deal ?
      </h2>
      <p>Although WeiCards looks like a regular website, it's not one, it's a Decentralized Applications (DApps). Cards are not loaded from our database (we do not host anything) but instead directly loaded from the Ethereum blockchain.
      This blockchain acts like a decentralized database where everyone can see it's state and cannot be tampered. Once you acquired a card, it is written in
      the blockchain and it remains forever yours. 
      </p>
      <p>
      The other cool stuff is that you can check the logic behind WeiCard by auditing the Smart Contract. You can have a look at the <a href="">smart contract on Etherscan</a>
      and the front-end <a href="">hosted on GitHub</a>.
      </p>

      <h2 class="ui header" id="what-do-i-need">
        What do I need ?
      </h2>
      <p>You only need a browser to view cards. However, you will need <a href="https://metamask.io/">MetaMask</a> to buy, lease and sell cards.
      <a href="https://metamask.io/">MetaMask</a> is a browser (<i class="fab fa-chrome"></i> Chrome and <i class="fab fa-firefox"></i> Firefox) plugin that bridge the Ethereum blockchain 
      and is the easiest way to interact with Smart Contract.</p>
      <p>
        This plugin provides you a wallet where you can send some Ether (Ξ) and will be your login access to buy, lease and sell cards ! Thus, there is no registration nor login form, just
        unlock a wallet on MetaMask and you have now access to every WeiCards features.
      </p>
      <p>
        The following video gives an introduction and a setup guide for MetaMask :
      </p>

      <div class="ui segment basic center aligned">
        <iframe width="560" height="315" src="https://www.youtube.com/embed/6Gf_kRE4MJU?rel=0" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen></iframe>
      </div>
    </div>
    <!-- 
      CARDS
     -->
    <div class="ui segment raised">
      <h2 class="ui header" id="buy-card">
        How do I buy a card ?
      </h2>
      <div class="ui stackable grid">
        <div class="column ten wide">
          <p>Cards available to purchase have a <span class="ui green tiny label"><i class="fa fa-shopping-cart"></i> Buy</span> ribbon in their top left corner.
          In order to buy this card, you can either click on this ribbon or the card footer 
          <i class="fa fa-shopping-cart"></i> <b>Buy</b> (< <i>Price</i> > Ξ).
          </p>
          <p>
          You will need to provide 3 things :
            <ul>
              <li><b>Title: </b> This is the title of your card, it can describe anything you want.
              Title must be less than 40 characters.</li>
              <li><b>URL: </b> URL to redirect to when visitors click on your card.</li>
              <li><b>Image: </b> URL of the image you want to display within the card.
              Images can be of any types supported by browsers (<i>e.g.</i> PNG, JPG, SVG <i>etc.</i>).
              Try to use an image with a 16:9 ratio and as lightweight as possible.</li>
            </ul>
          <div class="ui orange message">
            <b>Note</b> : the more your URL and image URL are longer, the more<b> you are paying</b> in fee !
            This is inherent to the Ethereum blockchain design.
          </div>
          </p>
        </div>
        <div class="column six wide">
          <!-- Card buy demo -->
          <div class="ui link cards">
            <div class="ui centered card raised">
              <div class="ui fluid image">
                <div class="ui floating right circular label card-id-label" :data-tooltip="`View card #5 details`" data-inverted="">
                    <b>5</b>
                </div>
                <img class="card-image" src="https://pagez.com/attachments/818/article/0/6becdabb07293ed0b06f628b9d3e0dc3.jpg">
                <!-- Ribbon available buy -->
                <a class="ui green tiny left ribbon label">
                  <i class="fa fa-shopping-cart"></i>
                  <b>Buy</b>
                </a>
              </div>
              <div class="content">
                <div class="ui header">
                  Kitty
                </div>
                <div class="meta">
                  kittycard.io
                </div>
              </div>
              <div class="extra content">
                <div class="ui grid equal width center aligned">
                  <div class="column green-hover"
                      :data-tooltip="`Buy card #5 at 1.23 Ξ`" data-inverted="">
                    <i class="fa fa-shopping-cart"></i>
                    Buy (<b>1.23 Ξ</b>)
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card-description">This cute little card is available to buy for 1.23 Ξ</div>
        </div>
      </div>

      <h2 class="ui header" id="sell-card">
        How do I sell a card ?
      </h2>
      <div class="ui stackable grid">
        <div class="column ten wide">
          <p>
            You obviously need to <router-link :to="{ name: 'FAQ', hash: '#buy-card' }" >own a card</router-link> in order to sell one.
            If you want to put one of yours on sale, select <i class="fa fa-dollar-sign"></i> <b>Sell</b> in the footer of a card or access
            <i class="fa fa-cogs"></i> <b>Settings</b> > <i class="fa fa-dollar-sign"></i> <b>Sell</b> in card details page.
          </p>
          <p>
            You just have to set the price you want it to be sold. Your card will now be listed as on sale, the ownership
            of your card will be transferred to the first buyer. You will then be credited of the transaction amount. <i>Note : 
            WeiCards take a 1% cut on this transaction.</i> 
          </p>
        </div>
        <div class="column six wide">
          <!-- Card buy demo -->
          <div class="ui link cards">
            <div class="ui centered card raised">
              <div class="ui fluid image">
                <div class="ui floating right circular label teal" :data-tooltip="`View card #99 details`" data-inverted="">
                    <b>99</b>
                </div>
                <img class="card-image" src="http://www.cbc.ca/natureofthings/content/images/episodes/foxtales_growingup.jpg">
              </div>
              <div class="content">
                <div class="ui header">
                  Kitty
                </div>
                <div class="meta">
                  kittycard.io
                </div>
              </div>
              <div class="extra content">
                <div class="ui grid equal width center aligned">
                  <div class="column green-hover" data-tooltip="Sell card #99" data-inverted="">
                    <i class="fa fa-dollar-sign"></i>
                    Sell
                  </div>
                  <div class="column orange-hover" data-tooltip="Set lease offer on card #99" data-inverted="">
                    <i class="fa fa-key"></i>
                    Lease
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card-description">Cards you own has a teal position label
            <span class="ui circular label teal"><b>99</b></span>
          </div>
        </div>
      </div>

      <h2 class="ui header" id="lease-card">
        How do I lease a card ?
      </h2>
      <h3 class="ui header" id="lease-card-tenant">> As tenant</h3>
      <div class="ui stackable grid">
        <div class="column six wide">
          <!-- Card tenant lease -->
          <div class="ui link cards">
            <div class="ui centered card raised">
              <div class="ui fluid image">
                <div class="ui floating right circular label card-id-label" :data-tooltip="`View card #34 details`" data-inverted="">
                    <b>34</b>
                </div>
                <img class="card-image" src="https://thumbs-prod.si-cdn.com/azaY6UJQr6w7GMO5NScOuYhUbIM=/800x600/filters:no_upscale()/https://public-media.smithsonianmag.com/filer/ef/ff/efff9ae5-1832-489f-bb1f-f1a00944a8aa/hedgehog.jpg">
               <!-- Ribbon available buy -->
                <a class="ui orange tiny left ribbon label">
                  <i class="fa fa-key"></i>
                  <b>Lease</b>
                </a>
              </div>
              <div class="content">
                <div class="ui header">
                  Squirrel
                </div>
                <div class="meta">
                  squirrel.zoo
                </div>
              </div>
              <div class="extra content">
                <div class="ui grid equal width center aligned">
                  <div class="column green-hover" @click.prevent="leaseCard()"
                      :data-tooltip="`Lease card #34 at 0.75 Ξ for 1 000 000 blocks`" data-inverted="">
                    <i class="fa fa-key"></i>
                    <b>0.75 Ξ</b> / 1 000 000 blocks
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card-description">Card #34 is available for a lease with a total amount of 0.75 Ξ for 1 000 000 blocks.</div>
        </div>
        <div class="column ten wide">
          <p>Cards available to rent have a <span class="ui orange tiny label"><i class="fa fa-key"></i> Lease</span> ribbon in their top left corner.
          Just as cards listed on sale, you can either click on this ribbon or the footer card footer
          <i class="fa fa-key"></i> < <i>Total amount</i> > Ξ / < <i>Block duration</i> >.
          </p>
          <p>
            Details of the lease are displayed in a table similar as the following :
          </p>
          <!-- Lease details -->
          <div class="ui segment basic grid equal width center aligned">
            <div class="column">
              <h3 class="ui header">Ξ Total Amount</h3>
              <b>0.75</b> Ether
            </div>
            <div class="column">
              <h3 class="ui header"><i class="far fa-clock"></i> Duration</h3>
              <b>1 000 000</b> blocks<br />
              {{ lease1EstimatedTime.fromNow() }}
              <span :data-tooltip="`Based on a 15 sec average block time : ${lease1EstimatedTime.format('LL')}`" data-inverted="">
              <i class="fa fa-question-circle"></i>
              </span>
            </div>
            <div class="column" style="word-wrap: break-word;">
              <h3 class="ui header"><i class="far fa-user"></i>Lessor</h3>
              <b>0x627306090abaB3A6e1400e9345bC60c78a8BEf57</b>
            </div>
          </div>
          <p>
            Where the <b>Ξ Total Amount</b> is the product of the <b>lease duration</b> and the <b>price per block</b>, this is paid beforehand by the
            tenant to the lessor. The <i class="far fa-clock"></i> <b>Duration</b> column display the duration of the lease in blocks. At the moment, 1 block &asymp; 15 seconds (<i>e.g.</i> 1 000 000 blocks is approximately 6 months).
            <i class="far fa-user"></i><b>Lessor</b> column display the current owner of the card. During lease offer creation, he set a fixed 
            <b>price per block</b> in Wei (1 Ether = 10<sup>18</sup> Wei).
          </p>
        </div>
      </div>
      <br />
      <p>
        You will have to fill the lease form and provide a title, a redirection URL and an image for your rental card.
        Check the <router-link :to="{ name: 'FAQ', hash: '#buy-card' }" >How do I buy a card ?</router-link> section to get more details on those fields.
        Once you submitted the rental form you will be requested to pay the <b>Ξ Total Amount</b> to the <i class="far fa-user"></i><b>Lessor</b>
        , the card you just rented will then display the details you provided until the <i class="far fa-clock"></i> <b>Duration</b> is over.
      </p>

      <h3 class="ui header" id="lease-card-lessor">> As lessor</h3>
      <p>
        As a card owner, you are able to rent it out at a fixed price for a determined duration. Cards eligible to rent has a 
        <i class="fa fa-key"></i> <b>Lease</b> button displayed in their footer. You also can set a card to rent by accessing its
        details page and select <i class="fa fa-cogs"></i> <b>Settings</b> > <i class="fa fa-key"></i> <b>Lease</b>.
      </p>
      <p>
        You will be asked to enter the amount per block in Wei. This amount represents the price you are asking to lease 
        your card for each block mined on the network. The duration field is the number of blocks you want to rent out your card, starting
        at the block number when tenant sign the deal. Considering an average block generation time of 15 seconds, 6 000 blocks
        is a day and 1 000 000 blocks is approximately 6 months.
      </p>
      <h2 class="ui header" id="edit-card">
        How can I edit a card ?
      </h2>
      <p>
        If you need to update some or all the details of your card, you are able to change them by accessing the card details page and
        select <i class="fa fa-cogs"></i> <b>Settings</b> > <i class="fa fa-wrench"></i> <b>Edit</b>. From there are you can  
        edit the card's title, URL and image.
      </p>

      <h2 class="ui header" id="transfer-card-owner">
        Can I transfer my card to another address ?
      </h2>
      <p>To transfer a card ownership to another address, go to card details page and select
         <i class="fa fa-cogs"></i> <b>Settings</b> > <i class="fa fa-exchange-alt"></i> <b>Transfer</b>.
         You will then be prompted to enter the address of the new card owner. This can be used if your account has been
         compromised.
      </p>
      <div class="ui orange message">
        <b>Note</b> : we strongly encourage to double-check the recipient address. If you transferred to a wrong address, consider
        your card as <b>lost</b>. 
      </div>
    </div>

    <div class="ui segment raised">
      <h2 class="ui header" id="fees">
        Is there any fees ?
      </h2>
      <p>Storing or updating data on the blockchain require a fee. Thus, managing your card (<i>i.e.</i> sell it, edit it etc...), require you
         to pay a small fee to those who maintain the blockchain. You can set the maximal fee you want to pay for, as so, you can set a very low
         fee if you accept that your operation take more time.</p>
      <p>
        Otherwise, there is a 1% fee on each card transaction (sell or lease). We are proud to reverse 10% of the profits generated by the initial cards sales
        to Giveth. Note that this 10% cut is only applied to the initial sale and will not be subtracted to your profits from selling or leasing cards.
      </p>

      <h2 class="ui header" id="what-is-giveth">
        What is Giveth ?
      </h2>
      <p>
        <a target="_blank" href="https://giveth.io/">Giveth</a> is an Open-Source Platform for building Decentralized Altruistic Communities (DAC).
      </p>
      <div class="ui basic segment">
        <q>
          Giveth is re-engineering charitable giving, by creating an entirely free, open-source platform, built on the Ethereum Blockchain.
          Our system cuts out bureaucracy and enables nonprofits to create a high level of transparency and accountability towards Givers.
          At any point until the moment funds are locked, a Giver can decide to withdraw them. 
        </q>
      </div>
      <p> You can learn more on Giveth <a target="_blank" href="https://medium.com/giveth/what-is-the-future-of-giving-d50446b0a0e4">here</a>.</p>
      
      <h2 class="ui header" id="who-are-you">
        Who are you ?
      </h2>
      <p>I'm a Computer Science student from Belgium. I'm into blockchain technology since mid 2017 and this is my first Smart Contract
        published on the Ethereum blockchain ! 
      </p>

      <h2 class="ui header" id="projects-money">
        What will you do with the money ?
      </h2>
      <p>I have other projects on the Ethereum blockchain, the profits made by WeiCards will help fund them. It will also be used
        to invest in other blockchain related projects.
      </p>
    </div>
  </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'faq',
  data () {
    return {
    }
  },
  computed: {
    lease1EstimatedTime () {
      const blockTime = 15
      let totalTimeSecond = 1000000 * blockTime
      return moment().add(totalTimeSecond, 's')
    }
  },
  methods: {
  },
  mounted () {
  }
}
</script>

<style scoped>
.container {
  max-width: 978px !important;
}
h2 {
  margin-bottom: 1em !important;
  margin-top: 1em !important;
}
h3 {
  margin-bottom: 1em !important;
  margin-top: 1em !important;
}
.card-description {
  font-style: italic;
  margin-top: 0.75em !important;
}
.card {
  max-width: 250px !important;
}
.card-image {
  max-height: 100px !important;
}
.card-id-label {
  color: rgba(255, 255, 255, 0.95);
  background-color: #F8C75B;
}
.ui.cards > .card > .content > .header, .ui.card > .content > .header {
  margin-bottom: 0.1em;
}
</style>
