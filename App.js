import React, { useEffect } from 'react';
import {useIAP, requestPurchase, withIAPContext, purchaseUpdatedListener} from "react-native-iap"
import {
  FlatList,
  Platform,
  SafeAreaView,
  Text,
  View,
} from 'react-native';


import { Button } from './components/Button';


const productIds = Platform.select({
  android: ['product3', 'product2', "1", "produit4", "produit100"]
})

function App() {
  const {
    connected, 
    products, 
    getProducts,
    finishTransaction, 
    currentPurchase, 
  } = useIAP()

  useEffect(()=>{
      if(connected){
       getProducts({skus: productIds})
      }
  }, [connected])


  useEffect(() => {
    const checkCurrentPurchase = async purchase => {
      if (purchase) {
        const receipt = purchase.transactionReceipt
        console.log("RECEIPT: ", receipt)
        if (receipt) {
          try {
            const ackResult = await finishTransaction({purchase, isConsumable: false})
            console.log("ackResult: ", ackResult)
          } catch (ackErr) {
            console.log("ackError: ", ackErr)
          }
        }
      }
    }
    checkCurrentPurchase(currentPurchase)
  }, [currentPurchase, finishTransaction])


  const purchaseProduct = async (productId) => {

    if (!connected) {
      return
    }
    else if (products?.length > 0) {
      requestPurchase({sku: productId})
      console.log("Purchasing products...")
    }
    // If we are connected but have no products returned, try to get products and purchase.
    else {
      console.log("No products. Now trying to get some...")
      try {
        await getProducts(productIds)
        requestPurchase(productId)
        console.log("Got products, now purchasing...")
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <SafeAreaView
      style={{
        flex: 1
      }}
    >
      <FlatList
        data={products}
        renderItem={({item})=>{
          return (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                flex: 1,
                paddingHorizontal: 20,
                marginVertical: 10
              }}
            >
              <Text
                style={{
                  color: "black",
                  fontSize: 17,
                  fontWeight: 700,
                  width: 100
                }}
              >
                {item.name}
              </Text>
              <Text
                style={{
                  color: "black",
                  fontSize: 17
                }}
              >
                {item.oneTimePurchaseOfferDetails.formattedPrice}
              </Text>
              <Button
                title={"buy"}
                onPress={()=>purchaseProduct(item.productId)}
              />
            </View>
          )
        }}
      />
    </SafeAreaView>
  );
}


export default withIAPContext(App);
