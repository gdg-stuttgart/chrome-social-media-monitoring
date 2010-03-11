require "config/environment"

def getTwitterResults params
  body=Net::HTTP.get URI.parse("http://search.twitter.com/search.json#{params}")
  JSON.parse(body)["results"]
end

def getTimeOfTweetByUrlParams params
  results=getTwitterResults params
  results.any?  ? results[0]["created_at"] : nil #funktioniert wenn es keinen Treffer gibt, oder wenn rpp=1
end

def getNumberOfTweetsPerMinuteSinceThousandsTweet(term)
	resultNumber=1000
	timeString=getTimeOfTweetByUrlParams("?q=#{URI.escape(term)}&rpp=1&page=#{resultNumber}")
	if timeString.nil?
		resultNumber=100
		timeString=getTimeOfTweetByUrlParams("?q=#{URI.escape(term)}&rpp=1&page=#{resultNumber}")
		if timeString.nil?
			resultNumber=10
			timeString=getTimeOfTweetByUrlParams("?q=#{URI.escape(term)}&rpp=1&page=#{resultNumber}")
			if timeString.nil?
				raise "Nicht genügend Tweets" #dies ist eine Exception, irgendwie im Frontend handeln
      end
    end
  end
	#nun haben wir ganz sicher ein timeString
  time=Time.parse(timeString)
  timeDiffInSeconds=(Time.now-time)
  timeDiffInSecondsOfThousandsTweet=timeDiffInSeconds*1000/resultNumber.to_f #hier wird normalisiert, alles als Float rechnen (.to_f)
  timeDiffInHoursSinceThousandsTweet=timeDiffInSecondsOfThousandsTweet/(60*60.0)
  numberOfTweetsPerMinuteSinceThousandsTweet=1000/(timeDiffInHoursSinceThousandsTweet*60)
  return numberOfTweetsPerMinuteSinceThousandsTweet
  #nun ist hochgerechnet auf Stunden
end


def getNumberOfTweetsPerMinuteNow(term)
  resultNumber=10
  results=getTwitterResults("?q=#{URI.escape(term)}&rpp=1000")
  #maximal die letzten 10 minuten durchsuchen
  timeOfTweet=Time.now #irgendein Initialwert
  index=0
  while timeOfTweet>1.minute.ago #so einfach geht das in rails :-)
    if results[index]
      timeOfTweet=Time.parse(results[index]["created_at"])
    else
      break #wow, soviele Tweets innerhalb  60 Sekunden!
    end
    index+=1
  end
  numberOfTweetsWithinOneMinute=index
  if numberOfTweetsWithinOneMinute==1000
    #das ist aber ne Menge, gib diese ungenaue Anzahl zurück. Der User will so ein Searchterm sicherlich soweiso nicht tracken wollen...
    return numberOfTweetsWithinOneMinute
  end
  if index==0
    return nil #wenn es keinen Treffer gab, dann gibts auch keinen Alert
  end
  if timeOfTweet<2.minutes.ago
    #kein einziger Tweet innerhalb der letzten 2 Minuten, dann andere Strategie:
    #vor wievielen Minuten waren der zehntletzte Treffer?
    if results[9]
      timeOfTenthTweet=Time.parse(results[9]["created_at"])
      secondsSinceTenthTweet=Time.now-timeOfTenthTweet
      minutesSinceTenthTweet=secondsSinceTenthTweet/60.0
      return 10/minutesSinceTenthTweet
    else
      return nil #wenn es nichtmal 10 Treffer, dann gibts auch keinen Alert
    end
  else
    return numberOfTweetsWithinOneMinute #
  end
end

def run term
  puts "term=#{term} tweetsPerMinuteNow=#{getNumberOfTweetsPerMinuteNow(term)}  tweetsPerMinuteSinceThousandsTweet=#{getNumberOfTweetsPerMinuteSinceThousandsTweet(term)}"
end

run "google" #keine Auffälligkeiten
run "test" #keine Auffälligkeiten
run "canon7d" #keine Auffälligkeiten
run "mark owen" #auch keine auffälligkeiten, obwohl es ein trending topic ist. Grund: die letzten 1000 tweets sind auch erst vor kurzem geschehen
run "#OMJDByeah" #hier  tweetsPerMinuteNow=0.9  und tweetsPerMinuteSinceThousandsTweet=0.25 , d.h. dies ist ein echter Alert!

#Ausgabe:
#term=google tweetsPerMinuteNow=59  tweetsPerMinuteSinceThousandsTweet=71.0330762571719
#term=test tweetsPerMinuteNow=23  tweetsPerMinuteSinceThousandsTweet=28.7302221372269
#term=canon7d tweetsPerMinuteNow=0.00601921735547299  tweetsPerMinuteSinceThousandsTweet=0.00837978528267854
#term=mark owen tweetsPerMinuteNow=7  tweetsPerMinuteSinceThousandsTweet=12.453279823981
#term=#OMJDByeah tweetsPerMinuteNow=0.968472823178889  tweetsPerMinuteSinceThousandsTweet=0.272281347849643
