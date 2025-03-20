package com.formcomp.components.models;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import java.util.List;
import java.io.IOException;

@Model(adaptables = Resource.class)
public class FormCompModel {

  @ValueMapValue
  private String questionsEndpoint;

  public List<Question> getQuestions() {
    try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
      HttpGet request = new HttpGet(questionsEndpoint);
      String response = EntityUtils.toString(httpClient.execute(request).getEntity());
      return new Gson().fromJson(response, new TypeToken<List<Question>>() {}.getType());
    } catch (IOException e) {
      throw new RuntimeException("Failed to fetch questions", e);
    }
  }

  public static class Question {
    private String id;
    private String label;
    private String name;
    private String type;
    private boolean required;
    private String pattern;

    // Getters
    public String getId() { return id; }
    public String getLabel() { return label; }
    public String getName() { return name; }
    public String getType() { return type; }
    public boolean isRequired() { return required; }
    public String getPattern() { return pattern; }
  }
}
