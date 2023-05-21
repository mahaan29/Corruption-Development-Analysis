
import csv


if __name__ == '__main__':
    cpi_result = []
    with open('cpi.csv', 'r') as file:
        reader = csv.reader(file)
        index = 0
        headers = None
        for row in reader:
            if index ==0:
                headers = row
                index = index + 1
                print(headers)
            else:
                y  = {}
                k = 0
                for x in headers:
                    y[x] = row[k]
                    k = k + 1
                # row
                y['Average_CPI_Score'] = ( int(y['CPI_2016_Score']) +int(y['CPI_2015_Score'])+int(y['CPI_2014_Score'])+int(y['CPI_2013_Score'])+int(y['CPI_2012_Score']))/5
                cpi_result.append(y)
                # print(y)
    data_result = []
    with open('data.csv', 'r') as file:
        reader = csv.reader(file)
        index = 0
        headers = None
        for row in reader:
            if index == 0:
                headers = row
                index = index + 1
                print(headers)
            else:
                y = {}
                k = 0
                for x in headers:
                    y[x] = row[k]
                    k = k + 1
                # row
                # y['Average_CPI_Score'] = (int(y['CPI_2016_Score']) + int(y['CPI_2015_Score']) + int(
                #     y['CPI_2014_Score']) + int(y['CPI_2013_Score']) + int(y['CPI_2012_Score'])) / 5
                data_result.append(y)
    print(cpi_result[0])
    print(data_result[0])
    result = []
    Country_Set = set()
    for cpi in cpi_result:
        c = cpi['Country']
        Country_Set.add(c)
    for d in data_result:
        d_c = d['Country']
        Country_Set.add(d_c)
    result = []
    for c in  Country_Set:
        for cpi in cpi_result:
            t = {}
            if cpi['Country'] ==c:
                t['CPI_2016_Score'] = cpi['CPI_2016_Score']
                t['CPI_2015_Score'] = cpi['CPI_2015_Score']
                t['CPI_2014_Score'] = cpi['CPI_2014_Score']
                t['CPI_2013_Score'] = cpi['CPI_2013_Score']
                t['CPI_2012_Score'] = cpi['CPI_2012_Score']
                t['Country'] = c
                t['Average_CPI_Score'] = cpi['Average_CPI_Score']
                t['Region'] = cpi['Region']
                result.append(t)
    for c in  Country_Set:
        for cpi in data_result:
            t = {}
            if cpi['Country'] ==c:
                t['CPI_2016_Score'] = cpi['CPI_2016_Score']
                t['CPI_2015_Score'] = cpi['CPI_2015_Score']
                t['CPI_2014_Score'] = cpi['CPI_2014_Score']
                t['CPI_2013_Score'] = cpi['CPI_2013_Score']
                t['CPI_2012_Score'] = cpi['CPI_2012_Score']
                t['Country'] = c
                t['Average_CPI_Score'] = cpi['Average_CPI_Score']
                reg = cpi['Region'].split(' ')
                # print()
                t['Region']=reg[0][0]+reg[-1][0]
                result.append(t)
    with open('cpi_r.csv', 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(['Region','Country','Average_CPI_Score','CPI_2016_Score','CPI_2015_Score','CPI_2014_Score','CPI_2013_Score','CPI_2012_Score'])
        for row in result:
            writer.writerow([row['Region'],row['Country'],
                             row['Average_CPI_Score'],
                             row['CPI_2016_Score'],
                             row['CPI_2015_Score'],row['CPI_2014_Score'],
                             row['CPI_2013_Score'],row['CPI_2012_Score']])
    # print(result)
    # print(result[0]['Average_CPI_Score'])