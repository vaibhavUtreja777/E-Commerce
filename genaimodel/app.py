import openai
import csv
import time

openai.api_key = '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'


def csv_to_json(csvFilePath):
    jsonArray = []
      
    #read csv file
    with open(csvFilePath, encoding='utf-8') as csvf: 
        #load csv file data using csv library's dictionary reader
        csvReader = csv.DictReader(csvf) 

        #convert each csv row into python dict
        for row in csvReader: 
            #add this python dict to json array
            jsonArray.append(row)
    return jsonArray

def BasicGeneration(userPrompt):
    completion = openai.ChatCompletion.create(
        model = "gpt-3.5-turbo-16k",
        n = 1,
        temperature = 0.2,
        messages = [
            {
                "role" : "user",
                "content" : userPrompt
            }
        ]
    )

    return completion.choices[0].message.content



databases = ["Men_TopWear" , "Men_BottomWear" , "Men_EthnicSets", "Men_Shoes" , "Women_Topwear" , "Women_EthnicWear", "Women_Jewellery" , "Women_Shoes" , "Women_BottomWear"]

def findDatabaseUsed(client_input):
    promptDBConversion = f"""
    Forget all previous conversation.
    You are a fashion designer working in fashion industry for 10 years. A Client comes to you with a request {client_input}.
    You have these sections available at your shop represented in form of array {databases}.
    You need to find only 1 section in which the client's need satisfies the most.
    Accurately match the gender of the client.
    Return the exact names of the most matching section according to you. Return the answer in string format.
    Don't assume any missing data the client's description is incomplete.
    Don't add additional formatting. Just return a single word without quotes ("")just like an API will do.
    """
    dbused = BasicGeneration(promptDBConversion)
    print(dbused)
    return dbused

def findJson(client_input , dbConsumed):
    promptl1 = f"""
    Ignore all previous information. Delete them from chat history.
    Analyse the sentence {client_input} on basis of fashion categories : {list(dbConsumed[0].keys())} ignore attributes : [Link, Image_Link, Name].
    Find Data to be put in each category. Return the output in json format.
    Don't assume any misssing data the statement is complete
    If there is some missing data don't return that attribute in JSON.
    Occasion can be either Casual Formal or Ethnic. For example a Kurta is of Ethnic Occasion.
    Accurately match occasion and cloth_type.
    Assume occasion to be casual if not given.
    cloth_type for men has three categories Shirt, T-Shirt and Kurta. 
    cloth_type for Women topwear has two categories Formal and Casual.
    cloth_type for Women ethnic wear has two categories Kurti and Saree.
    Women Jewellery has no field clothType.
    Gender is not an occasion.
    Accurately match the category ignore inconsistencies just follow the rules given.
    Accurately match these a Shirt is entirely different from a T-shirt.
    For example, consider a sample sentence : 'I want a blue colored show', this sentence has no information about price so the returned JSON should not have price section.
    Note sample sentence has no relevance to client input sentence. If their is not enough information or information is not provided or value for an attribute is null or undefined 
    ignore that attribute in output.
    The JSON format should have the fashion categories as the keys and their values. that you will find remember that price is a float only field.
    Don't add additional formatting. Just return JSON just like an API does.
    """
    jsonPrompt = BasicGeneration(promptl1)
    return jsonPrompt

def generateResponses(jsonPrompt , dbConsumed) :
    prompt = f"""
    Ignore all previous information.
    You are an experienced fashion designer who can suggest brilliant choices acccording to customers need.The request of the customer is stored inside {jsonPrompt}
    this has various attributes, each showing the choice of the customer you need to return the top 3 to choices which most accurately match the customer's choice.
    All the details of products in your shop are given in a json format in the following array {dbConsumed}, lets name this array dbconsumed 
    you need to extract the id by matching the jsonPrompt and the category which contains the attribute that is requested by the customer.
    You don't need to exactly match the strings for each attribute select the response with highest similarity percentage.
    Example : "Brand" : "Levi's" and "Brand" : "levis" is almost similar so such an output can be selected.
    For doing this follow this priority order(1 being the most important):
    1) The occasion and clothType is most Important. Accurately mathc the cloth Type and occasion.
    2) If the brand is mention in the jsonPrompt in the "brand" section display those items only
    3)The budget ,the displayed result should fit in the price range mentioned try to select the most expensive product that fits in price range and is not violating previous priorities.
    Output Format : <Id_of_Suggestion_1> <Id_of_Suggestion_2> <Id_of_Suggestion_3> 
    Don't add additional formatting. Just return single line just like an API does.
      """
    promptSol = BasicGeneration(prompt)
    return promptSol


def responseGenerator(client_input):
    dbused = findDatabaseUsed(client_input)
    dbConsumed = csv_to_json(f'C:/Users/Yatin/Downloads/L2-Submission-Ultra-Instinct/E-Commerce/code/data/{dbused}.csv')
    time.sleep(5)
    jsonPrompt = findJson(client_input,dbConsumed)
    print(jsonPrompt)
    time.sleep(5)
    response = {
        "db" : dbused,
        "indexes" : generateResponses(jsonPrompt , dbConsumed)
    }
    print(response["indexes"])
    return response