import MovieCard from "@/components/MovieCard"
import SearchBar from "@/components/SearchBar"
import { icons } from "@/constants/icons"
import { images } from "@/constants/images"
import { fetchMovies } from "@/services/api"
import useFetch from "@/services/useFetch"
import React, { useEffect, useState } from "react"
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native"

const Search = () => {
    const {
        data: movies,
        loading: moviesLoading,
        refetch: loadMovies,
        reset,
        error: moviesError
    } = useFetch(() => fetchMovies({ query: searchQuery }), false)

    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (searchQuery.trim()) {
                await loadMovies()
            } else {
                reset()
            }
        }, 500)

        return () => clearTimeout(timeoutId)
    }, [searchQuery])

    return (
        <View className="flex-1 bg-primary">
            <Image
                source={images.bg}
                className="absolute z-0 w-full flex-1"
                resizeMode="cover"
            />

            <FlatList
                data={movies}
                renderItem={({ item }) => <MovieCard {...item} />}
                keyExtractor={item => item.id.toString()}
                className="px-5"
                numColumns={3}
                columnWrapperStyle={{
                    justifyContent: "center",
                    gap: 16,
                    marginVertical: 16
                }}
                contentContainerStyle={{ paddingBottom: 100 }}
                ListHeaderComponent={
                    <>
                        <View className="mt-20 w-full flex-row items-center justify-center">
                            <Image source={icons.logo} className="h-10 w-12" />
                        </View>
                        <View className="my-5">
                            <SearchBar
                                placeholder="Search"
                                value={searchQuery}
                                onChangeText={(text: string) =>
                                    setSearchQuery(text)
                                }
                            />
                        </View>
                        {moviesLoading && (
                            <ActivityIndicator
                                size="large"
                                color="#0000ff"
                                className="my-3"
                            />
                        )}

                        {moviesError && (
                            <Text className="my-3 px-5 text-red-500">
                                Error: {moviesError.message}
                            </Text>
                        )}
                        {!moviesLoading &&
                            !moviesError &&
                            searchQuery.trim() &&
                            movies?.length > 0 && (
                                <Text className="text-xl font-bold text-white">
                                    Search Results for{" "}
                                    <Text className="text-accent">
                                        {searchQuery}
                                    </Text>
                                </Text>
                            )}
                    </>
                }
                ListEmptyComponent={
                    !moviesLoading && !moviesError ?
                        <View className="mt-10 px-5">
                            <Text className="text-center text-gray-500">
                                {searchQuery.trim() ?
                                    "No movies found"
                                :   "Search for a movie"}
                            </Text>
                        </View>
                    :   null
                }
            />
        </View>
    )
}

export default Search
